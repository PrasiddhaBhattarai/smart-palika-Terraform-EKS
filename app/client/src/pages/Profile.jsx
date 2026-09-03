import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiMapPin, FiShield, FiEdit } from 'react-icons/fi';

const Profile = () => {
  const { user, changePassword } = useAuth();
  // console.log(user);
  
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [wards, setWards] = useState([]);

useEffect(() => {
  const fetchWards = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/ward'); // ✅ using port 3000
      const data = await res.json();
      setWards(data);
    } catch (err) {
      console.error('Failed to fetch wards:', err);
    }
  };

  fetchWards();
}, []);
  

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setMessage('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage('New passwords do not match');
      setIsChangingPassword(false);
      return;
    }

    const result = await changePassword(passwordForm.oldPassword, passwordForm.newPassword);
    
    if (result.success) {
      setMessage('Password changed successfully!');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setMessage(result.message);
    }
    
    setIsChangingPassword(false);
  };
const userWard = wards.find(w => Number(w.id) === Number(user?.ward_id));
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h1 className="text-2xl font-bold text-nepal-blue mb-6">Profile Information</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-center p-4 bg-blue-50 rounded-lg">
            <div className="bg-nepal-blue p-3 rounded-full mr-4">
              <FiUser className="h-6 w-6 text-white" />
            </div>
             <div className="flex-1 min-w-0"> {/* <-- key change */}
    <p className="text-sm text-gray-600">Full Name</p>
    <p className="font-medium truncate" title={user?.name}>
      {user?.name}
    </p>
  </div>
          </div>

          <div className="flex items-center p-4 bg-blue-50 rounded-lg">
            <div className="bg-nepal-red p-3 rounded-full mr-4">
              <FiMail className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0"> {/* <-- key change */}
    <p className="text-sm text-gray-600">Email Address</p>
    <p className="font-medium truncate" title={user?.email}>
      {user?.email}
    </p>
  </div>
          </div>

          <div className="flex items-center p-4 bg-blue-50 rounded-lg">
            <div className="bg-green-600 p-3 rounded-full mr-4">
              <FiShield className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Role</p>
              <p className="font-medium capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-blue-50 rounded-lg">
            <div className="bg-purple-600 p-3 rounded-full mr-4">
              <FiMapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Ward</p>
<p className="font-medium">
  {userWard?.name || `Ward ${user?.ward_id || 'Not specified'}`}
</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-nepal-blue mb-6 flex items-center">
          <FiEdit className="mr-2" />
          Change Password
        </h2>

        {message && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.includes('successfully') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              id="oldPassword"
              value={passwordForm.oldPassword}
              onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
              className="form-input"
              required
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
              className="form-input"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Password must be 8-15 characters with uppercase, lowercase, number, and special character
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isChangingPassword}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isChangingPassword ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;







// import React, { useState, useRef } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { FiUser, FiMail, FiMapPin, FiShield, FiEdit, FiCamera, FiX } from 'react-icons/fi';

// const Profile = () => {
//   const { user, changePassword, updateProfileImage } = useAuth();
//   const [passwordForm, setPasswordForm] = useState({
//     oldPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
//   const [isChangingPassword, setIsChangingPassword] = useState(false);
//   const [message, setMessage] = useState('');
//   const [imageMessage, setImageMessage] = useState('');
//   const [isUploading, setIsUploading] = useState(false);
//   const fileInputRef = useRef(null);

//   const handlePasswordChange = async (e) => {
//     e.preventDefault();
//     setIsChangingPassword(true);
//     setMessage('');

//     if (passwordForm.newPassword !== passwordForm.confirmPassword) {
//       setMessage('New passwords do not match');
//       setIsChangingPassword(false);
//       return;
//     }

//     const result = await changePassword(passwordForm.oldPassword, passwordForm.newPassword);
    
//     if (result.success) {
//       setMessage('Password changed successfully!');
//       setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
//     } else {
//       setMessage(result.message);
//     }
    
//     setIsChangingPassword(false);
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Validate file type and size
//     if (!file.type.startsWith('image/')) {
//       setImageMessage('Please select an image file');
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) { // 5MB limit
//       setImageMessage('Image size should be less than 5MB');
//       return;
//     }

//     setIsUploading(true);
//     setImageMessage('');

//     try {
//       const result = await updateProfileImage(file);
//       if (result.success) {
//         setImageMessage('Profile image updated successfully!');
//       } else {
//         setImageMessage(result.message || 'Failed to update image');
//       }
//     } catch (error) {
//       setImageMessage('Error uploading image');
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const removeProfileImage = async () => {
//     setIsUploading(true);
//     setImageMessage('');

//     try {
//       const result = await updateProfileImage(null); // Pass null to remove image
//       if (result.success) {
//         setImageMessage('Profile image removed successfully!');
//       } else {
//         setImageMessage(result.message || 'Failed to remove image');
//       }
//     } catch (error) {
//       setImageMessage('Error removing image');
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const triggerFileInput = () => {
//     fileInputRef.current?.click();
//   };

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       {/* Profile Image Section */}
//       <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
//         <h1 className="text-2xl font-bold text-nepal-blue mb-6">Profile Image</h1>
        
//         <div className="flex flex-col items-center">
//           <div className="relative mb-4">
//             <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
//               {user?.profile_image ? (
//                 <img 
//                   src={user.profile_image} 
//                   alt="Profile" 
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <FiUser className="h-16 w-16 text-gray-400" />
//               )}
//             </div>
            
//             {user?.profile_image && (
//               <button
//                 onClick={removeProfileImage}
//                 disabled={isUploading}
//                 className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
//               >
//                 <FiX className="h-4 w-4" />
//               </button>
//             )}
            
//             <button
//               onClick={triggerFileInput}
//               disabled={isUploading}
//               className="absolute bottom-0 right-0 bg-nepal-blue text-white p-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
//             >
//               <FiCamera className="h-4 w-4" />
//             </button>
//           </div>

//           <input
//             type="file"
//             ref={fileInputRef}
//             onChange={handleImageUpload}
//             accept="image/*"
//             className="hidden"
//             disabled={isUploading}
//           />

//           {imageMessage && (
//             <div className={`mt-2 p-2 rounded-lg text-sm ${
//               imageMessage.includes('successfully') 
//                 ? 'bg-green-100 text-green-800' 
//                 : 'bg-red-100 text-red-800'
//             }`}>
//               {imageMessage}
//             </div>
//           )}

//           <p className="text-sm text-gray-600 text-center mt-2">
//             Click the camera icon to upload a new profile image
//           </p>
//           <p className="text-xs text-gray-500 text-center mt-1">
//             Supported formats: JPG, PNG, GIF • Max size: 5MB
//           </p>
//         </div>
//       </div>

//       {/* Profile Information Section */}
//       <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
//         <h1 className="text-2xl font-bold text-nepal-blue mb-6">Profile Information</h1>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//           <div className="flex items-center p-4 bg-blue-50 rounded-lg">
//             <div className="bg-nepal-blue p-3 rounded-full mr-4">
//               <FiUser className="h-6 w-6 text-white" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm text-gray-600">Full Name</p>
//               <p className="font-medium truncate" title={user?.name}>
//                 {user?.name}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center p-4 bg-blue-50 rounded-lg">
//             <div className="bg-nepal-red p-3 rounded-full mr-4">
//               <FiMail className="h-6 w-6 text-white" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm text-gray-600">Email Address</p>
//               <p className="font-medium truncate" title={user?.email}>
//                 {user?.email}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center p-4 bg-blue-50 rounded-lg">
//             <div className="bg-green-600 p-3 rounded-full mr-4">
//               <FiShield className="h-6 w-6 text-white" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Role</p>
//               <p className="font-medium capitalize">{user?.role?.replace('_', ' ')}</p>
//             </div>
//           </div>

//           <div className="flex items-center p-4 bg-blue-50 rounded-lg">
//             <div className="bg-purple-600 p-3 rounded-full mr-4">
//               <FiMapPin className="h-6 w-6 text-white" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Ward</p>
//               <p className="font-medium">{user?.ward_id || 'Not specified'}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Change Password Section */}
//       <div className="bg-white rounded-2xl shadow-lg p-6">
//         <h2 className="text-xl font-bold text-nepal-blue mb-6 flex items-center">
//           <FiEdit className="mr-2" />
//           Change Password
//         </h2>

//         {message && (
//           <div className={`mb-4 p-3 rounded-lg ${
//             message.includes('successfully') 
//               ? 'bg-green-100 text-green-800' 
//               : 'bg-red-100 text-red-800'
//           }`}>
//             {message}
//           </div>
//         )}

//         <form onSubmit={handlePasswordChange} className="space-y-4">
//           <div>
//             <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">
//               Current Password
//             </label>
//             <input
//               type="password"
//               id="oldPassword"
//               value={passwordForm.oldPassword}
//               onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
//               className="form-input"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
//               New Password
//             </label>
//             <input
//               type="password"
//               id="newPassword"
//               value={passwordForm.newPassword}
//               onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
//               className="form-input"
//               required
//             />
//             <p className="text-xs text-gray-500 mt-1">
//               Password must be 8-15 characters with uppercase, lowercase, number, and special character
//             </p>
//           </div>

//           <div>
//             <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
//               Confirm New Password
//             </label>
//             <input
//               type="password"
//               id="confirmPassword"
//               value={passwordForm.confirmPassword}
//               onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
//               className="form-input"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={isChangingPassword}
//             className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isChangingPassword ? 'Changing Password...' : 'Change Password'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Profile;