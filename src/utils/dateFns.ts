export const dateFns = {
  format: (date: Date, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en', options).format(date),
  //
  parseDate: (serverDate: string, type: 'date' | 'time' | 'datetime' = 'datetime') => {
    let result = null;
    if (serverDate && serverDate.length > 10) {
      let [date, time] = serverDate.split(" ")
      let [year, month, day] = date.split("-") as unknown as number[]
      let [hour, minute, second] = time.split(":") as unknown as number[]

      if (type === 'datetime') {
        result = new Date(year, month - 1, day, hour, minute, second);
      } else if (type === 'date') {
        result = new Date(year, month - 1, day, 0, 0, 0);
      } else if (type === 'time') {
        let now = new Date();
        result = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, second);
      }
    }
    return result;
  },
  stringifyDate: (date: Date, type: 'date' | 'time' | 'datetime' = 'datetime') => {
    let result = ''
    if (type === 'date' || type === 'datetime') {
      result += `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    }
    if (type === 'datetime') {
      result += ' '
    }
    if (type === 'time' || type === 'datetime') {
      result += `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    }
    return result;
  },
  //
  addMonth: (date: Date, amount: number) => new Date(date.getFullYear(), date.getMonth() + amount),
  getMonthInfo: (date: Date) => ({
    index: date.getMonth(),
    daysArray: (() => {
      const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1),
        lastDayOfMonth = new Date(nextMonth.getTime() - 1),
        daysInMonth = lastDayOfMonth.getDate();
      let arrayOfDays = [...new Array(daysInMonth + 1).keys()]
      arrayOfDays.shift();
      return arrayOfDays
    })(),
    shortName: dateFns.format(date, { month: 'short' }),
    longName: dateFns.format(date, { month: 'long' })
  }),
  //
  getDayInfo: (date: Date) => ({
    index: date.getMonth(),
    shortName: dateFns.format(date, { weekday: 'short' }),
    longName: dateFns.format(date, { weekday: 'long' })
  })

}