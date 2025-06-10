<?php

namespace App\Enums;

enum UserRole: string
{
    case USER = 'user';
    case WORKER = 'worker';
    case ADMIN = 'admin';
}
