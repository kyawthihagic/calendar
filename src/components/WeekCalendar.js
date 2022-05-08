import { Card } from "antd";
import moment from "moment";
import EventItem, { top } from "./EventItem";
import styles from "./WeekCalendar.module.css";

export const compareByTime = (first, second) => {
  if (first.start.isBefore(second.start)) return -1;
  if (first.start.isAfter(second.start)) return 1;
  if (first.end.isBefore(second.end)) return 1;
  if (first.end.isAfter(second.end)) return -1;
  return 0;
};

export const sortAppointments = (appointments) =>
  appointments.slice().sort((a, b) => compareByTime(a, b));

export const findOverlappedAppointments = (sortedAppointments) => {
  const appointments = sortedAppointments.slice();
  const groups = [];
  let totalIndex = 0;

  while (totalIndex < appointments.length) {
    groups.push([]);
    const current = appointments[totalIndex];
    const currentGroup = groups[groups.length - 1];
    let next = appointments[totalIndex + 1];
    let maxBoundary = current.end;

    currentGroup.push(current);
    totalIndex += 1;
    while (next && maxBoundary.isAfter(next.start)) {
      currentGroup.push(next);
      if (maxBoundary.isBefore(next.end)) maxBoundary = next.end;
      totalIndex += 1;
      next = appointments[totalIndex];
    }
  }
  return groups;
};

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

  Object.keys(eventList).map(function (key) {
    const sorted = sortAppointments(
      eventList[key].map(({ start, end, ...obj }) => ({
        start: moment(start),
        end: moment(end),
        ...obj,
      }))
    );
    eventList[key] = findOverlappedAppointments(sorted);
  });

  console.log(eventList);

  const addEvent = (date) => (e) => {
    e.stopPropagation();
    if (e.target.getAttribute("data-type") === "dayGrid") {
      const rect = e.target.getBoundingClientRect();
      const y = e.clientY - rect.top; //y position within the element.
      let minute = Math.round(y * 0.625 + 7.5 * 60 + 1);
      minute = (((minute + 7.5) / 15) | 0) * 15;
      console.log(minute);
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
                eventList[day.date].map((events) =>
                  events.map((event, index) => (
                    <EventItem
                      key={event.id}
                      event={event}
                      index={index}
                      width={80 / events.length}
                      updateEvent={updateEvent}
                    />
                  ))
                )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WeekCalendar;
