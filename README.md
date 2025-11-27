# 📘 Learning Management System (LMS) API

Sistem manajemen pembelajaran berbasis **microservices** menggunakan **Golang**, **Gin**, **GORM**, dan **MySQL** untuk mengelola proses perkuliahan digital seperti autentikasi, course, materi, tugas, dan pengumpulan tugas.

---

## 👥 Nama Anggota Kelompok

| No | Nama                                 | NIM      | Role                                           |
| -- | ------------------------------------ | -------- | ---------------------------------------------- |
| 1  | **Theresia Ananda Eleonora**         | 42230054 | Backend — Auth Service                         |
| 2  | **Denilson Leonardo Natu**           | 42230035 | Frontend 					|
| 3  | **I Putu Ngurah Rio Aditya Pratama** | 42230030 | Backend — Course Service                       |
| 4  | **Arfian Sarianto Pendang**          | 42230017 | Backend — Operational Service                  |

---

## 🎯 Tema Aplikasi

**Learning Management System (LMS)** — Aplikasi manajemen pembelajaran berbasis arsitektur microservices.

---

## 📝 Deskripsi Singkat Proyek

Aplikasi LMS ini dirancang untuk mendukung proses pembelajaran digital dalam lingkungan kampus. Sistem berjalan dalam arsitektur **microservices**, yang memisahkan fungsi utama menjadi tiga service independen:

1. **Auth Service** — Mengelola autentikasi, registrasi, dan seluruh manajemen user (Admin, Dosen, Mahasiswa).
2. **Course Service** — Mengelola mata kuliah, materi, dan akses pembelajaran oleh dosen & mahasiswa.
3. **Operational Service** — Mengelola tugas (assignment) dan pengumpulan tugas (submission) oleh mahasiswa.

Setiap service memiliki **database masing-masing**, berjalan di port berbeda, dan beroperasi secara modular sehingga lebih mudah di-maintain, dikembangkan, maupun di-scale.

---

## ⚙️ Cara Menjalankan Proyek

### **1. Clone Repository**

```
git clone https://github.com/Arfiannn/TRIAL.git
```

### **2. Jalankan Menggunakan Docker Compose**

Pastikan sudah terpasang **Docker** & **Docker Compose**.

```
docker-compose up --build
```

Service akan berjalan otomatis pada port berikut:

* Auth Service → `http://localhost:8001`
* Course Service → `http://localhost:8081`
* Operational Service → `http://localhost:8010`
* MySQL Database → `localhost:3306`

---

## 📚 Dokumentasi API Sederhana

```
AUTH SERVICE (PORT 8001)

Public:
GET    /faculties
GET    /majors

Authentication:
POST   /auth/register/admin
POST   /auth/register/dosen
POST   /auth/register/mahasiswa
POST   /auth/login

Admin:
GET    /admin/users/pending
POST   /admin/approve/user
GET    /admin/users
DELETE /admin/pending/:id
DELETE /admin/user/:id
PUT    /admin/user/:id/semester

-----------------------------------------

COURSE SERVICE (PORT 8081)

Admin – Course Management:
POST   /admin/courses
GET    /admin/courses
GET    /admin/courses/:id
PUT    /admin/courses/:id
DELETE /admin/courses/:id

Lecturer – Course Management:
GET    /lecturer/courses
GET    /lecturer/courses/:id

Lecturer – Material Management:
POST   /lecturer/materials
GET    /lecturer/materials
GET    /lecturer/materials/:id
PUT    /lecturer/materials/:id
DELETE /lecturer/materials/:id
GET    /lecturer/materials/:id/file

Student – Course & Materials:
GET    /student/courses
GET    /student/courses/:id
GET    /student/materials/:courseId
GET    /student/materials/view/:id

-----------------------------------------

OPERATIONAL SERVICE (PORT 8010)

Assignments (Lecturer):
POST   /assignments
GET    /assignments
GET    /assignments/:id
PUT    /assignments/:id
DELETE /assignments/:id
GET    /assignments/:id/file

Submissions (Student):
POST   /submission
GET    /submission
GET    /submission/:id
GET    /submission/:id/file
```

---

## ✨

Proyek **TRIAL – Learning Management System (LMS)** Sistem ini dibangun untuk memberikan pengalaman pembelajaran digital yang terstruktur, mudah digunakan, aman, serta dapat dikembangkan lebih lanjut.

Jika terdapat saran, masukan, atau ingin berkolaborasi, tim kami sangat terbuka untuk diskusi dan pengembangan lanjutan.

