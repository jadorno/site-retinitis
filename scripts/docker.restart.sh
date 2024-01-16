docker stop retinitis-node
docker rm retinitis-node

docker run --name retinitis-node -d -e SMTP_URL=smtp://172.17.0.1 -v /mnt/storage00/documents/projects/active/retinitis-node/data/message:/usr/src/app/submit/message -v /mnt/storage00/documents/projects/active/retinitis-node/data/application:/usr/src/app/submit/application -v /mnt/storage00/documents/projects/active/retinitis-node/static:/usr/src/app/html -p 192.168.252.11:5000:8002 localhost/node_retinitis
