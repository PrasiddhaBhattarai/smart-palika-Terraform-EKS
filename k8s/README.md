## Kubernetes manifests
This directory contains Kubernetes manifests for deploying a frontend, backend, and Redis service. It also includes configuration for networking, autoscaling, service accounts, and namespace management.

## Architecture
```
                    Internet
                       |
                       v
                 +-----------+
                 |  Ingress  |
                 +-----------+
                       |
                       v
              +----------------+
              |    Frontend    |
              |    Service     |
              +----------------+
                       |
                       v
              +----------------+
              |    Frontend    |
              |      Pods      |
              +----------------+
                       |
                       v
              +----------------+
              |    Backend     |
              |    Service     |
              +----------------+
                       |
                       v
              +----------------+
              |    Backend     |
              |      Pods      |
              +----------------+
                       |
                       v
              +----------------+
              | Redis Service   |
              +----------------+
                       |
                       v
              +----------------+
              | Redis Pods      |
              +----------------+
```

## File Structure
```
.
├── README.md
├── app-config.yaml
├── backend-deployment.yaml
├── backend-hpa.yaml
├── backend-pod-ServiceAccount.yaml
├── backend-service.yaml
├── frontend-deployment.yaml
├── frontend-service.yaml
├── ingress.yaml
├── namespace.yaml
├── redis-deployment.yaml
└── redis-service.yaml
```

## File description
| File | Description |
|---|---|
| `app-config.yaml` | Stores application configuration values, typically using a ConfigMap or similar Kubernetes configuration resource. |
| `backend-deployment.yaml` | Defines the backend Deployment, including its container image, replicas, ports, and pod configuration. |
| `backend-hpa.yaml` | Configures Horizontal Pod Autoscaling for the backend based on resource usage. |
| `backend-pod-ServiceAccount.yaml` | Defines the ServiceAccount used by backend pods to access Kubernetes resources when required. |
| `backend-service.yaml` | Creates a Kubernetes Service to expose the backend pods within the cluster. |
| `frontend-deployment.yaml` | Defines the frontend Deployment, including its container image, replicas, ports, and pod configuration. |
| `frontend-service.yaml` | Creates a Kubernetes Service to expose the frontend pods within the cluster. |
| `ingress.yaml` | Configures Kubernetes Ingress to route external HTTP/HTTPS traffic to the appropriate services. |
| `namespace.yaml` | Creates the Kubernetes namespace where the application resources are deployed. |
| `redis-deployment.yaml` | Defines the Redis Deployment used by the application for caching, sessions, or other in-memory data. |
| `redis-service.yaml` | Creates a Kubernetes Service that allows other application components to communicate with Redis. |
