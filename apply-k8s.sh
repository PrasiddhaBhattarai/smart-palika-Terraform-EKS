```bash
#!/bin/bash

set -e

NAMESPACE="sm-app"
K8S_DIR="k8s"

# echo "Creating namespace: $NAMESPACE"
#
# --dry-run=client : kubectl itself does the dry run locally instead of sending the create request to the Kubernetes API server.
#
# -o yaml: tells kubectl to output the namespace as YAML instead of actually creating it.
#
# then apply that yaml file
#
# kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

echo "Deploying Kubernetes manifests from $K8S_DIR..."
# deploys all yaml file insdie the directory
kubectl apply -f "${K8S_DIR}/namespace.yaml"
kubectl apply -f "${K8S_DIR}/"

echo "Deployment complete!"

echo ""
echo "Resources:"
kubectl get all -n "$NAMESPACE"
```
