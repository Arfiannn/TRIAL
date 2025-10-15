import type { Assignment, Course, Faculty,  Major, Material, Submission, User, UserApproved,  } from "@/types";

export const mockFaculty: Faculty[] = [
  {
    id: 1,
    name: "Teknik dan Informatika"
  },
  {
    id: 2,
    name: "Hukum"
  },
  {
    id: 3,
    name: "Ilmu Sosial dan Humaniora"
  },
  {
    id: 4,
    name: "Ekonomi dan Bisnis"
  },
]

export const mockMajor: Major[] = [
  {
    id: 1,
    facultyId: 1,
    name: "Teknologi Informasi"
  },
  {
    id: 2,
    facultyId: 2,
    name:"Hukum"
  },
  {
    id: 3,
    facultyId: 3,
    name: "Ilmu Komunikasi",
  },
  {
    id: 4,
    facultyId: 4,
    name: "Akuntansi"
  }
]

export const mockUser: User[] = [
  {
    id: 1,
    email: 'admin@gmail.com',
    name: 'administrator',
    password: '12345678',
    role: 'administrator',
    createdAt: new Date('2024-10-10')
  },
  {
    id: 2,
    majorId: 1,
    email: 'Rizky@gmail.com',
    name: 'Rizky Febian',
    password: '12345678',
    role: 'dosen',
    createdAt: new Date('2024-10-09')
  },
  {
    id: 3,
    majorId: 1,
    email: 'andika@gmail.com',
    name: 'Andika Putra',
    password: '12345678',
    role: 'mahasiswa',
    semester: 1,
    createdAt: new Date('2024-10-11')
  },
  {
    id: 4,
    majorId: 2,
    email: 'melisa@studentmail.com',
    name: 'Melisa Pratiwi',
    password: '12345678',
    role: 'mahasiswa',
    semester: 5,
    createdAt: new Date('2024-10-08')
  },
  {
    id: 5,
    majorId: 2,
    email: 'aguslecturer@campus.ac.id',
    name: 'Agus Santoso',
    password: '12345678',
    role: 'dosen',
    createdAt: new Date('2024-10-07')
  },
  {
    id: 6,
    majorId: 1,
    email: 'lina@studentmail.com',
    name: 'Lina Wulandari',
    password: '12345678',
    role: 'mahasiswa',
    semester: 1,
    createdAt: new Date('2024-10-06')
  },
  {
    id: 7,
    majorId: 3,
    email: 'rizkylecturer@univ.edu',
    name: 'Rizky Saputra',
    password: '12345678',
    role: 'dosen',
    createdAt: new Date('2024-10-05')
  },
  {
    id: 8,
    majorId: 4,
    email: 'yohana@studentmail.com',
    name: 'Yohana Siahaan',
    password: '12345678',
    role: 'mahasiswa',
    semester: 4,
    createdAt: new Date('2024-10-04')
  },
  {
    id: 9,
    majorId: 1,
    email: 'budi@studentmail.com',
    name: 'Budi Hartono',
    password: '12345678',
    role: 'mahasiswa',
    semester: 1,
    createdAt: new Date('2024-10-03')
  },
  {
    id: 10,
    majorId: 4,
    email: 'natalialecturer@univ.edu',
    name: 'Natalia Dewi',
    password: '12345678',
    role: 'dosen',
    createdAt: new Date('2024-10-02')
  }
];

export const mockUserApproved: UserApproved[] = [
  {
    id: 1,
    userId: 1,
  },
  {
    id: 2,
    userId: 2,
  },
  {
    id: 3,
    userId: 3,
  },
  {
    id: 4,
    userId: 5,
  },
  {
    id: 5,
    userId: 6,
  },
  {
    id: 6,
    userId: 9,
  },
]

export const mockCourses: Course[] = [
  {
    id: 1,
    majorId: 1,
    lecturerId: 2,
    semester: 1,
    name: 'Pemrograman Dasar',
    credits: 3,
    description: 'Mata kuliah pengenalan pemrograman dengan Python',
    day: 'Senin',
    startTime: '08:00',
    endTime: '10:00'
  },
  {
    id: 2,
    majorId: 1,
    lecturerId: 2,
    semester: 1,
    name: 'Matematika Diskrit',
    credits: 3,
    description: 'Dasar-dasar matematika untuk ilmu komputer',
    day: 'Selasa',
    startTime: '12:00',
    endTime: '16:00'
  },
  {
    id: 3,
    majorId: 1,
    lecturerId: 2,
    semester: 2,
    name: 'Algoritma dan Struktur Data',
    credits: 4,
    description: 'Pemahaman algoritma dan struktur data fundamental',
    day: 'Kamis',
    startTime: '11:00',
    endTime: '14:00'
  },
  {
    id: 4,
    majorId: 3,
    lecturerId: 5,
    semester: 2,
    name: 'Basis Data',
    credits: 3,
    description: 'Konsep dan implementasi sistem basis data',
    day: 'Senin',
    startTime: '8:00',
    endTime: '12:00'
  }
];

export const mockAssignments: Assignment[] = [
  {
    id: 1,
    courseId: 1,
    title: "Tugas 1: Hello World Program",
    description:
      "Buat program sederhana yang menampilkan 'Hello World' dalam berbagai bahasa pemrograman (Python, Java, C, dan Go).",
    dueDate: new Date("2025-10-16"),
    maxScore: 100,
    fileUrl: "/files/file1.pdf",
    createdAt: new Date("2024-10-01"),
  },
  {
    id: 2,
    courseId: 1,
    title: "Tugas 2: Struktur Percabangan",
    description:
      "Implementasikan struktur kontrol if-else dan switch dalam program interaktif yang meminta input dari pengguna.",
    dueDate: new Date("2025-11-01"),
    maxScore: 100,
    fileUrl: "/files/file1.pdf",
    createdAt: new Date("2024-10-10"),
  },
  {
    id: 3,
    courseId: 2,
    title: "Tugas 1: Logika Proposisi dan Tabel Kebenaran",
    description:
      "Selesaikan soal-soal mengenai logika proposisi, konjungsi, disjungsi, implikasi, dan buat tabel kebenaran untuk setiap kasus.",
    dueDate: new Date("2025-10-25"),
    maxScore: 100,
    fileUrl: "/files/file1.pdf",
    createdAt: new Date("2024-09-30"),
  },
  {
    id: 4,
    courseId: 3,
    title: "Tugas 1: Implementasi Stack dan Queue",
    description:
      "Buat implementasi struktur data Stack dan Queue menggunakan bahasa pemrograman pilihan Anda.",
    dueDate: new Date("2025-10-28"),
    maxScore: 100,
    fileUrl: "/files/file1.pdf",
    createdAt: new Date("2024-10-05"),
  },
  {
    id: 5,
    courseId: 4,
    title: "Tugas 1: Desain ERD dan Normalisasi",
    description:
      "Rancang ERD untuk sistem perpustakaan dan lakukan normalisasi hingga bentuk normal ke-3.",
    dueDate: new Date("2025-11-05"),
    maxScore: 100,
    fileUrl: "/files/file1.pdf",
    createdAt: new Date("2024-10-07"),
  },
];

export const mockMaterials: Material[] = [
  {
    id: 1,
    courseId: 1,
    title: 'Pengenalan Python',
    description: 'Materi pengenalan bahasa pemrograman Python untuk pemula',
    createdBy: 1,
    fileUrl: "/files/file1.pdf",
    createdAt: new Date('2024-09-15')
  },
  {
    id: 2,
    courseId: 2,
    title: 'Variabel dan Tipe Data',
    description: 'Penjelasan tentang variabel dan berbagai tipe data dalam Python',
    createdBy: 1,
    fileUrl: "/files/file1.pdf",
    createdAt: new Date('2024-09-20')
  }
];

export const mockSubmissions: Submission[] = [
  {
    id: 1,
    assignmentId: 1,
    studentId: 3, // Andika Putra
    submittedAt: new Date("2025-10-12"),
    fileUrl: "/files/file1.pdf",
  },
  {
    id: 2,
    assignmentId: 1,
    studentId: 6,
    submittedAt: new Date("2025-09-07"),
    fileUrl: "/files/file1.pdf",
  },
];