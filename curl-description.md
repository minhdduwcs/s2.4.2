# cURL Description

- constants
  ```
  STUDENT_RANK = {
    EXCELLENT: 'd8b6a724-7a16-4f48-8cc3-409a04a84bb7',
    GOOD: '686faf56-d573-42ab-b37e-363ded840995',
    AVERAGE: 'ed9ef384-4d70-47f4-90ac-3babcde899a3',
    WEAK: '3e553c5f-9589-4a8a-b292-cad1b08b5224'
  }
  ```

## 1. create student

```
curl
  -XPOST '/students'
  -d '{
    "firstName": "Nguyen",
    "lastName": "Van A",
    "phoneNumber": "+84123456789",
    "email": "nguyenvana@gmail.com",
    "rank": "686faf56-d573-42ab-b37e-363ded840995"
  }'
```

## 2. get list of students

```
curl -XGET '/students?q=01234&rank=ed9ef384-4d70-47f4-90ac-3babcde899a3'
```

## 3. get student by id

```
curl -XGET '/students/6263a7ccca5fdb6035a84a7d'
```

## 4. update student

```
curl
  -XPUT '/students/6263a7ccca5fdb6035a84a7d'
  -d '{
    "firstName": "Nguyen",
    "lastName": "Thi B",
    "phoneNumber": "+84123456789",
    "email": "nguyenthib@gmail.com",
    "rank": "686faf56-d573-42ab-b37e-363ded840995"
  }'
```

## 5. delete student

```
curl -XDELETE '/students/6263a7ccca5fdb6035a84a7d'
```