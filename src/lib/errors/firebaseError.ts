export function getCustomerSafeErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  const code = typeof error === 'object' && error !== null && 'code' in error ? String((error as { code?: unknown }).code) : '';
  const messages: Record<string, string> = {
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/user-not-found': 'Invalid email or password.',
    'auth/wrong-password': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'functions/not-found': 'We could not find the requested item.',
    'functions/invalid-argument': 'Please check the details and try again.',
    'functions/failed-precondition': 'This action cannot be completed right now.',
    'functions/permission-denied': 'You do not have permission to complete this action.',
    'permission-denied': 'You do not have permission to complete this action.',
    'unavailable': 'Service is temporarily unavailable. Please try again.',
  };
  return messages[code] || fallback;
}

export function getArabicCustomerSafeErrorMessage(error: unknown, fallback = 'حدث خطأ غير متوقع. حاول مرة أخرى.'): string {
  const code = typeof error === 'object' && error !== null && 'code' in error ? String((error as { code?: unknown }).code) : '';
  const messages: Record<string, string> = {
    'auth/invalid-credential': 'بيانات الدخول غير صحيحة.',
    'auth/user-not-found': 'بيانات الدخول غير صحيحة.',
    'auth/wrong-password': 'بيانات الدخول غير صحيحة.',
    'auth/too-many-requests': 'محاولات كثيرة. حاول لاحقًا.',
    'functions/not-found': 'لم نتمكن من العثور على البيانات المطلوبة.',
    'functions/invalid-argument': 'تأكد من البيانات وحاول مرة أخرى.',
    'functions/failed-precondition': 'لا يمكن تنفيذ هذا الإجراء الآن.',
    'functions/permission-denied': 'ليس لديك صلاحية لتنفيذ هذا الإجراء.',
    'permission-denied': 'ليس لديك صلاحية لتنفيذ هذا الإجراء.',
    'unavailable': 'الخدمة غير متاحة مؤقتًا. حاول مرة أخرى.',
  };
  return messages[code] || fallback;
}
