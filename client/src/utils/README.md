# Toast Notification Utilities

Utility functions untuk menampilkan toast notifications menggunakan react-hot-toast.

## Import

```javascript
import { 
  showSuccess, 
  showError, 
  showLoading, 
  showInfo, 
  dismissToast, 
  dismissAllToasts,
  showPromise 
} from '../utils/toast';
```

## Functions

### showSuccess(message)
Menampilkan toast notification dengan tipe success (hijau).

```javascript
showSuccess('Data berhasil disimpan!');
```

### showError(message)
Menampilkan toast notification dengan tipe error (merah).

```javascript
showError('Terjadi kesalahan saat menyimpan data');
```

### showLoading(message)
Menampilkan toast notification dengan loading state. Mengembalikan toast ID untuk dismiss.

```javascript
const loadingToast = showLoading('Sedang memproses...');
// ... async operation
dismissToast(loadingToast);
```

### showInfo(message)
Menampilkan toast notification dengan tipe info (abu-abu dengan icon ℹ️).

```javascript
showInfo('Demo credentials telah diisi');
```

### dismissToast(toastId)
Menghilangkan toast notification berdasarkan ID.

```javascript
const toastId = showLoading('Loading...');
// ... operation
dismissToast(toastId);
```

### dismissAllToasts()
Menghilangkan semua toast notifications yang sedang ditampilkan.

```javascript
dismissAllToasts();
```

### showPromise(promise, messages)
Otomatis menangani loading, success, dan error state dari promise.

```javascript
showPromise(
  apiCall(),
  {
    loading: 'Sedang menyimpan...',
    success: 'Data berhasil disimpan!',
    error: 'Gagal menyimpan data'
  }
);
```

## Contoh Penggunaan

### Form Submission
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const loadingToast = showLoading('Sedang menyimpan...');
  
  try {
    await saveData(formData);
    dismissToast(loadingToast);
    showSuccess('Data berhasil disimpan!');
  } catch (error) {
    dismissToast(loadingToast);
    showError(error.message);
  }
};
```

### Promise API
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  showPromise(
    saveData(formData),
    {
      loading: 'Sedang menyimpan data...',
      success: 'Data berhasil disimpan!',
      error: 'Gagal menyimpan data'
    }
  );
};
```

### Validation
```javascript
const validateForm = () => {
  if (!formData.name.trim()) {
    showError('Nama harus diisi');
    return false;
  }
  
  if (!formData.email.trim()) {
    showError('Email harus diisi');
    return false;
  }
  
  return true;
};
```

## Konfigurasi

Toast notifications dikonfigurasi di `App.jsx` dengan pengaturan:

- **Position**: `top-right`
- **Duration**: 4000ms (default), 3000ms (success), 5000ms (error)
- **Style**: Dark theme dengan warna yang sesuai untuk setiap tipe

## Best Practices

1. **Gunakan loading toast** untuk operasi async yang membutuhkan waktu
2. **Dismiss loading toast** sebelum menampilkan success/error
3. **Gunakan showPromise** untuk operasi yang sederhana
4. **Validasi form** dengan showError untuk feedback yang cepat
5. **Jangan spam** - hindari menampilkan terlalu banyak toast sekaligus 