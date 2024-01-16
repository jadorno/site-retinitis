podman stop node_retinitis
podman rm node_retinitis

podman run --name node_retinitis -d -e SMTP_URL=smtp://172.17.0.1 -p 192.168.252.2:6000:8002 -v /mnt/storage00/documents/projects/active/jadorno-cloud/data/com-retinitispigmentosapr/message:/usr/src/app/submit/message -v /mnt/storage00/documents/projects/active/jadorno-cloud/data/com-retinitispigmentosapr/application:/usr/src/app/submit/application 192.168.200.9:5000/node_retinitis
