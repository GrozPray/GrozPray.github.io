// prayer-notifications.js

// Функция для запроса разрешения на уведомления
function requestNotificationPermission() {
    if (!("Notification" in window)) {
        console.log("Этот браузер не поддерживает уведомления");
        return false;
    }

    if (Notification.permission === "granted") {
        return true;
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("Разрешение на уведомления получено!");
                return true;
            } else {
                console.log("Разрешение на уведомления не получено");
                return false;
            }
        });
    }
    return false;
}

// Функция для отправки уведомления
function sendNotification(title, message) {
    if (Notification.permission === "granted") {
        new Notification(title, { 
            body: message,
            icon: "images/logo.png" // путь к вашему логотипу
        });
        
        // Можно добавить звук (раскомментируйте если нужно)
        // new Audio('notification.mp3').play();
    }
}

// Функция для проверки времени намаза
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

            for (const [prayer, time] of Object.entries(timings)) {
                if (prayerNames[prayer] && time === currentTime) {
                    sendNotification(
                        'Время намаза!', 
                        `Сейчас время ${prayerNames[prayer]} (${time}). Пора совершить намаз 🙏`
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

// Запрашиваем разрешение сразу при загрузке скрипта
requestNotificationPermission();

// Проверяем время намаза каждую минуту
setInterval(checkPrayerTimesAndNotify, 60000);

// Проверяем сразу при загрузке
checkPrayerTimesAndNotify();
