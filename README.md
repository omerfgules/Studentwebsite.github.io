# Studentwebsite

A simple first version of a student progress portal built with vanilla HTML, CSS, and JavaScript.

## Features

- Email/password demo authentication stored in browser `localStorage`.
- Teacher and student user roles.
- Student signup includes assigned teacher selection.
- Student records store their selected `teacherId` relationship.
- Student dashboard shows the logged-in student's own progress.
- Teacher dashboard shows only students assigned to the logged-in teacher.
- Basic progress fields for completed lessons, study percentage, recent activity, and assignment status.
- Role-aware navigations.

## Getting started

```bash
npm run start
```

Sample accounts use the password `password`:

- `avery.teacher@example.com`
- `jordan.teacher@example.com`
- `mia.student@example.com`
