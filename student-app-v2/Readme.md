# Code convention

## Đặt tên cho branch

- khi sprint đó muốn code mới student feature
  ```
  feature/student-service
  ```

- khi sprint đó muốn cập nhật student feature
  ```
  enhance/student-service
  ```

- khi có hotfix từ production
  ```
  hotfix/student-service
  ```

## Commit format

- tạo mới 1 service: thêm cả service và mapping cùng 1 lúc
  ```
  add student service
  ```

- thêm 1 method trong service
  ```
  [student-service] add getStudents method
  ```

- chỉnh sửa trong method của service đó
  ```
  [student-service/getStudents] add filter by slug field
  ```
