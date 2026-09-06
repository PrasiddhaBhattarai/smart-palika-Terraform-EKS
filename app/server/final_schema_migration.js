/**
 * Consolidated baseline migration.
 *
 * This single migration reproduces the final schema state that results from
 * running all of the following migrations in order:
 *   1752753406312_create-users-wards-complaints-tables.js
 *   1752827415789_alter-contraints.js
 *   1752984707309_add-palikaTable-and-link-to-wards.js
 *   1753001409168_add-geojson-index-in-wards.js
 *   1753187949559_add-columns-to-complaints.js
 *   1753283638427_create-images-table-and-refrence-it-to-complaints.js
 *   1754017377488_add-province-to-palika.js
 *   1754017793936_add-unique-constraint-to-palika-name.js
 *   1754240584434_normalize-supporter-ids.js
 *   1754243928961_add-supported-at-to-complaint-supporters.js
 *   1754308473152_shift-rating-to-complaint-supporters.js
 *
 * IMPORTANT: If this replaces the migrations above, make sure your
 * migrations table / history is reset accordingly (e.g. this is intended
 * for a fresh database, not to be run alongside the originals).
 *
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const up = (pgm) => {
  // ---------------------------------------------------------------------
  // Extensions
  // ---------------------------------------------------------------------
  pgm.sql(`CREATE EXTENSION IF NOT EXISTS postgis`);

  // ---------------------------------------------------------------------
  // palika
  // ---------------------------------------------------------------------
  pgm.createTable("palika", {
    id: "id",
    name: { type: "text", notNull: true },
    type: { type: "text", notNull: true },
    province: { type: "text" },
  });

  pgm.addConstraint("palika", "palika_unique_name_type", {
    unique: ["name"],
  });

  // ---------------------------------------------------------------------
  // wards
  // ---------------------------------------------------------------------
  pgm.createTable("wards", {
    id: "id",
    name: { type: "text", notNull: true },
    geojson_polygon: { type: "geometry(polygon, 4326)", notNull: true },
    palika_id: {
      type: "integer",
      references: "palika(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.createIndex("wards", "geojson_polygon", {
    method: "gist",
  });

  // ---------------------------------------------------------------------
  // users
  // ---------------------------------------------------------------------
  pgm.createTable("users", {
    id: "id",
    name: { type: "text", notNull: true },
    email: { type: "text", notNull: true, unique: true },
    password_hash: { type: "text", notNull: true },
    role: { type: "text", notNull: true },
    ward_id: {
      type: "integer",
      references: '"wards"',
      onDelete: "SET NULL",
    },
  });

  pgm.addConstraint("users", "check_users_role", {
    check: "role IN ('user', 'ward_admin', 'municipality_admin')",
  });

  // ---------------------------------------------------------------------
  // images
  // ---------------------------------------------------------------------
  pgm.createTable("images", {
    id: "id",
    url: { type: "text", notNull: true },
    public_id: { type: "text", notNull: true },
    uploaded_at: { type: "timestamp", default: pgm.func("CURRENT_TIMESTAMP") },
  });

  // ---------------------------------------------------------------------
  // complaints
  // ---------------------------------------------------------------------
  pgm.createTable("complaints", {
    id: "id",
    user_id: {
      type: "integer",
      references: '"users"',
      onDelete: "CASCADE",
      notNull: true,
    },
    ward_id: {
      type: "integer",
      references: '"wards"',
      onDelete: "SET NULL",
    },
    description: { type: "text", notNull: true },
    photo_path: {
      type: "integer",
      references: '"images"',
      onDelete: "SET NULL",
    },
    location: { type: "geometry(Point, 4326)", notNull: true },
    status: {
      type: "text",
      notNull: true,
      default: "registered",
    },
    rating: {
      type: "numeric(3,2)",
      check: "rating >= 1 AND rating <= 5",
      default: null,
    },
    resolved_at: {
      type: "timestamp",
      default: null,
    },
    tags: {
      type: "text[]",
      default: "{}",
    },
    submitted_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
    escalated_to_municipality: {
      type: "boolean",
      notNull: true,
      default: false,
    },
  });

  pgm.addConstraint("complaints", "check_complaints_status", {
    check: `status IN (
      'registered',
      'under_review',
      'assigned',
      'in_progress',
      'resolved'
    )`,
  });

  pgm.addConstraint("complaints", "unique_photo_path", "UNIQUE(photo_path)");

  // ---------------------------------------------------------------------
  // complaint_supporters
  // ---------------------------------------------------------------------
  pgm.createTable("complaint_supporters", {
    complaint_id: {
      type: "integer",
      notNull: true,
      references: "complaints(id)",
      onDelete: "CASCADE",
    },
    user_id: {
      type: "integer",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },
    supported_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
    rating: {
      type: "integer",
      check: "rating BETWEEN 1 AND 5",
      default: null,
    },
    feedback: { type: "text", default: null },
  });

  pgm.addConstraint("complaint_supporters", "pk_complaint_user", {
    primaryKey: ["complaint_id", "user_id"],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const down = (pgm) => {
  pgm.dropTable("complaint_supporters");
  pgm.dropTable("complaints");
  pgm.dropTable("images");
  pgm.dropTable("users");
  pgm.dropTable("wards");
  pgm.dropTable("palika");
  pgm.sql(`DROP EXTENSION IF EXISTS postgis`);
};