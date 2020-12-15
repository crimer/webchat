type DateOptions = {
    hour12?: boolean
    hour?: string
    minute?: string
    year?: string
    day?: string
    month?: string
    timeZone?: string
    timeZoneName?: string
}
enum DateType {
    Time = 'time',
    Date = 'date',
    DateTime = 'datetime',
}

/**
 * Форматирование даты
 * @param datetime сама дата
 * @param type тип отображения (дата, время или оба), по дефолту только время
 */
const formatDate = (datetime: number, type: DateType = DateType.Time) => {
    const options: DateOptions = { hour12: false, timeZone: 'Asia/Vladivostok' }

    if (type.includes('time')) {
        options.hour = 'numeric'
        options.minute = 'numeric'
    }
    if (type.includes('date')) {
        options.year = 'numeric'
        options.month = 'numeric'
        options.day = 'numeric'
    }
    return new Intl.DateTimeFormat('ru-RU', options).format(new Date(datetime))
}

export { DateType, formatDate }
