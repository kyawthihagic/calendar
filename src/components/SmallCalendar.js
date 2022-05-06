import { Calendar, Select, Radio, Col, Row, Typography } from "antd";
import moment from "moment";
import styles from "./SmallCalendar.module.css";
import "./SmallCalendar.css";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

function onPanelChange(value, mode) {
  console.log(value, mode);
}

const getDays = (weekStart) => {
  const days = [];

  for (var i = 0; i < 7 * 6; i++) {
    const date = moment(weekStart).add(i, "days");
    days.push(date);
  }
  return days;
};

export default ({ setSelectDate, selectDate }) => {
  const weekStart = selectDate.clone().startOf("month").startOf("week");

  const days = getDays(weekStart).map((day) => {
    return {
      day,
      isCurrentMonth: day.month() === selectDate.month(),
      isToday: day.isSame(moment(), "day"),
      isSelected: day.isSame(selectDate, "day"),
      isCurrenWeek: day.isSame(selectDate, "week"),
    };
  });

  const firstWeekDays = [...days].slice(0, 7);

  const years = [];

  for (var i = -10; i < 10; i++) {
    years.push(selectDate.clone().add(i, "years"));
  }

  const onChange = (day) => (e) => {
    setSelectDate(day);
  };

  const nextMonth = (e) => {
    setSelectDate(selectDate.clone().add(1, "month"));
  };

  const prevMonth = (e) => {
    setSelectDate(selectDate.clone().add(-1, "month"));
  };

  const onChangeYear = (year) => {
    setSelectDate(selectDate.clone().year(year));
  };

  const onChangeMonth = (month) => {
    setSelectDate(selectDate.clone().month(month));
  };
  return (
    <div className={styles.siteCalendarCustomizeHeaderWrapper}>
      <div className={styles.header}>
        <LeftOutlined className={styles.actionIcon} onClick={prevMonth} />
        <div className={`${styles.headerInfo} smallCalendarCustomizeSelect`}>
          <div className={styles.month}>
            <Select
              defaultValue={selectDate.format("MMMM")}
              onChange={onChangeMonth}
              style={{ width: 120, borderWidth: 0 }}
            >
              {moment.months().map((month) => (
                <Select.Option key={month} value={month}>
                  {month}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className={styles.year}>
            <Select
              style={{ width: 100 }}
              defaultValue={selectDate.year()}
              onChange={onChangeYear}
            >
              {years.map((year) => (
                <Select.Option key={year.year()} value={year.year()}>
                  {year.year()}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
        <RightOutlined className={styles.actionIcon} onClick={nextMonth} />
      </div>
      <div className={styles.dayContainers}>
        {firstWeekDays.map(({ day }) => (
          <div key={day.toLocaleString()} className={styles.dateWeekNameItem}>
            {day.format("ddd")}
          </div>
        ))}
        {days.map(
          ({ day, isCurrentMonth, isToday, isSelected, isCurrenWeek }) =>
            isCurrentMonth ? (
              <div
                key={day.toLocaleString()}
                onClick={onChange(day)}
                className={`${styles.dateItem} ${styles.isCurrentMonth}  ${
                  isCurrenWeek ? styles.isCurrenWeek : ""
                } ${isToday ? styles.isToday : ""}  ${
                  isSelected ? styles.isSelected : ""
                }`}
              >
                {day.format("DD")}
              </div>
            ) : (
              <div
                key={day.toLocaleString()}
                className={`${styles.dateItem} ${styles.isNotCurrentMonth}  ${
                  isCurrenWeek ? styles.isCurrenWeek : ""
                } `}
                onClick={onChange(day)}
              >
                {day.format("DD")}
              </div>
            )
        )}
      </div>
    </div>
  );
};
