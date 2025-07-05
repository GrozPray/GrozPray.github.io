// prayer-notifications.js

// Функция для отправки уведомления
function sendNotification(title, message) {
    // Проверяем поддержку уведомлений в браузере
    if (!("Notification" in window)) {
        console.log("Этот браузер не поддерживает уведомления");
        return;
    }

    // Проверяем разрешение на отправку уведомлений
    if (Notification.permission === "granted") {
        // Если разрешение есть, отправляем уведомление
        new Notification(title, { body: message });
    } else if (Notification.permission !== "denied") {
        // Запрашиваем разрешение, если его еще нет
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(title, { body: message });
            }
        });
    }
}

// Функция для проверки времени намаза и отправки уведомлений
function checkPrayerTimesAndNotify() {
    fetch('https://api.aladhan.com/v1/timingsByCity?city=Grozny&country=Russia&method=2')
        .then(response => response.json())
        .then(data => {
            const timings = data.data.timings;
            const now = new Date();
            const currentTime = formatTime(now.getHours(), now.getMinutes());

            const prayerNames = {
                'Fajr': 'Фаджр',
                'Dhuhr': 'Зухр',
                'Asr': 'Аср',
                'Maghrib': 'Магриб',
                'Isha': 'Иша'
            };

            // Проверяем каждый намаз
            for (const [prayer, time] of Object.entries(timings)) {
                if (prayerNames[prayer] && time === currentTime) {
                    sendNotification(
                        'Время намаза!', 
                        `Сейчас время ${prayerNames[prayer]}. Пора совершить намаз 🙏`
                    );
                }
            }
        })
        .catch(error => {
            console.error("Ошибка при получении времени намаза:", error);
        });
}

// Вспомогательная функция для форматирования времени
function formatTime(hours, minutes) {
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
}

// Проверяем время намаза каждую минуту
setInterval(checkPrayerTimesAndNotify, 60000);

// Проверяем сразу при загрузке
checkPrayerTimesAndNotify();

// Экспортируем функции, если нужно использовать в других файлах
export { sendNotification, checkPrayerTimesAndNotify };
