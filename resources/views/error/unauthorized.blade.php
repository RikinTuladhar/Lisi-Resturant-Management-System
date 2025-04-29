<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Unauthorized Access</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center">
    <h1 class="display-3 text-danger">403</h1>
    <h2 class="mb-3">Unauthorized Access</h2>
    <p>You do not have permission to access this page.</p>
    <a href="{{ url('/') }}" class="btn btn-primary mt-3">Go to Homepage</a>
</body>
</html>
