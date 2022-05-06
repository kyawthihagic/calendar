import { Card } from "antd";
import moment from "moment";
import EventItem, { top } from "./EventItem";
import styles from "./WeekCalendar.module.css";

const times = [];
for (let i = 8 * 60; i < 24 * 60; i += 30) {
  times.push(
    `${Math.floor(i / 60)
      .toString()
      .padStart(2, 0)}:${Math.floor(i % 60)
      .toString()
      .padStart(2, 0)}`
  );
}
times.push(null);

const groupBy = (x, f) => x.reduce((a, b) => ((a[f(b)] ||= []).push(b), a), {});

function WeekCalendar({ evetDb, selectDate, addNewEvent, updateEvent }) {
  const weekdays = [];

  const currentDate = selectDate ? moment(selectDate) : moment();

  const todyDate = moment();

  const todyDateTimeMinute = todyDate.isSame(selectDate, "week")
    ? moment.duration(todyDate.format("HH:mm")).asMinutes()
    : 0;

  const weekStart = currentDate.clone().startOf("week");

  for (var i = 0; i <= 6; i++) {
    const date = moment(weekStart).add(i, "days");
    weekdays.push({
      day: date.format("D"),
      weekDayName: moment(weekStart).add(i, "days").format("dddd"),
      date: date.format("YYYY-MM-DD"),
    });
  }

  const eventList = groupBy(evetDb, ({ start }) =>
    moment(start).format("YYYY-MM-DD")
  );

  const addEvent = (date) => (e) => {
    e.stopPropagation();
    if (e.target.getAttribute("data-type") === "dayGrid") {
      const rect = e.target.getBoundingClientRect();
      const y = e.clientY - rect.top; //y position within the element.
      const minute = y * 0.625 + 7.5 * 60 + 1;
      const start = moment(
        `${date}T${Math.floor(minute / 60)
          .toString()
          .padStart(2, 0)}:${Math.floor(minute % 60)
          .toString()
          .padStart(2, 0)}`
      );
      const end = start.clone().add(30, "minutes");
      addNewEvent({ start, end, type: "new" });
    }
  };

  console.log("render week calendar");

  return (
    <div className={styles.weekTimeGridContainer}>
      <div className={styles.weekIndicator}>
        {weekdays.map((item) => (
          <div className={styles.weekIndicatorItem} key={item.day}>
            <span>{item.weekDayName}</span>
            <span>{item.day}</span>
          </div>
        ))}
      </div>
      <div className={styles.timeIndicatorsTimeGrid}>
        <div className={styles.timeIndicators}>
          {times.map((time, index) => (
            <div className={styles.timeIndicatorItem} key={time}>
              <span>{time}</span>
            </div>
          ))}
        </div>
        <div className={styles.time_gird}>
          <div className={styles.timeDayGrid}>
            {times.map((hour) => (
              <div className={styles.time_day} key={hour}></div>
            ))}
          </div>
          {todyDateTimeMinute > 0 && (
            <div className={styles.timeDayGrid}>
              <div
                className={styles.todayDatTime}
                style={{
                  top: top(todyDateTimeMinute),
                }}
              ></div>
            </div>
          )}

          {weekdays.map((day, index) => (
            <div
              className={styles.day_gird}
              onClick={addEvent(day.date)}
              data-type="dayGrid"
              key={day.day}
            >
              {eventList[day.date]?.length &&
                eventList[day.date].map((event) => (
                  <EventItem
                    key={event.id}
                    event={event}
                    updateEvent={updateEvent}
                  />
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WeekCalendar;
