# MONGO vs. DOCKER

## Recipe 1: cài đặt mongo bằng docker

- mở terminal
- tải và chạy mongo trên một version cụ thể
  ```
  sudo docker run --name mongo-5.0 -d mongo:5.0
  ```
  - `mongo-5.0` chỉ là tên của container, có thể đặt tên tùy ý
  - để chỉ định version cụ thể cho mongo, thay đổi `mongo:5.0`
  - có thể lựa chọn các version khác của mongo [ở đây](https://hub.docker.com/_/mongo?tab=tags)

## Recipe 2: vào shell của mongo

- mở terminal
- truy cập vào môi trường docker của mongo
  ```
  sudo docker exec -it mongo-5.0 bash
  ```
- truy cập vào shell của mongo
  ```
  mongo --host localhost --port 27017
  ```

## Recipe 3: kết nối mongo và robo3t

- mở terminal
- tìm địa chỉ ip của mongo trên docker
  ```
  sudo docker inspect mongo-5.0
  ```
  - địa chỉ ip nằm ở: NetworkSettings > Networks > bridge > IPAddress

- mở robo3t
- tạo 1 connection trong robo3t với
  - host: địa chỉ ip của mongo mới tìm ở trên
  - port: 27017
- kết nối tới mongo
