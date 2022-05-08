import {
  LeftCircleOutlined,
  LeftOutlined,
  RightOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Card } from "antd";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import styles from "./index.module.css";
import SmallCalendar from "./SmallCalendar";
import WeekCalendar from "./WeekCalendar";

const uuid = () => {
  // Public Domain/MIT
  var d = new Date().getTime(); //Timestamp
  var d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0; //Time in microseconds since page-load or 0 if unsupported
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
};

const colors = [
  {
    card: "#fff0f0",
    indicator: "#e84847",
    title: "#41479c",
    name: "#41479c",
    time: "#e84847",
  },
  {
    card: "#EAECFE",
    indicator: "#5A37A0",
    title: "#757DBD",
    name: "#757DBD",
    time: "#989DD0",
  },
];

const getColor = () => ({
  ...colors[Math.floor(Math.random() * colors.length)],
});

const evetDb = [
  {
    id: uuid(),
    title: "受託開発プロジェ外のSE・プロ グラマ",
    name: "Myat Myat",
    start: "2022-05-04T10:10:00",
    end: "2022-05-04T11:20:00",
    color: getColor(),
  },
  {
    id: uuid(),
    title: "SE・プログラマ",
    name: " Cho Cho Lwin",
    start: "2022-05-04T14:10:00",
    end: "2022-05-04T17:20:00",
    color: getColor(),
  },
  {
    id: uuid(),
    title: "受託開発プロジェ クトのSE・プロ グラマ",
    name: "Khin Myo Wai",
    start: "2022-05-06T10:10:00",
    end: "2022-05-06T11:20:00",
    color: getColor(),
  },
  {
    id: uuid(),
    title: "SE METTING 2",
    name: "Kyaw Thi Ha",
    start: "2022-05-08T12:10:00",
    end: "2022-05-08T16:20:00",
    color: getColor(),
  },
];

function Index() {
  const [selectDate, setSelectDate] = useState(moment());

  const [events, setEvents] = useState([]);

  const fetchEventsByWeek = () => {
    setEvents(evetDb);
    console.log("events", evetDb);
    // api call events by wweek
  };
  const nextWeek = (e) => {
    e.preventDefault();
    handleSetSelectDate(selectDate.clone().add(1, "week"));
  };

  const prevWeek = (e) => {
    e.preventDefault();
    handleSetSelectDate(selectDate.clone().add(-1, "week"));
  };

  useEffect(() => {
    fetchEventsByWeek();
  }, []);

  const addNewEvent = (event) => {
    setEvents([...events, { ...event, id: uuid(), color: getColor() }]);
  };

  const handleSetSelectDate = (date) => {
    if (!date.isSame(selectDate, "week")) {
      // fetchEventsByWeek();
    }
    setSelectDate(date);
  };

  const updateEvent = (event) => {
    setEvents(
      events.map((e) => {
        if (e.id === event.id) {
          return event;
        }
        return e;
      })
    );
  };
  return (
    <Card className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.action}>
          <Button
            shape="circle"
            onClick={prevWeek}
            icon={<LeftOutlined />}
            size="large"
          />
          <Button
            shape="circle"
            onClick={nextWeek}
            icon={<RightOutlined />}
            size="large"
          />
        </div>
        <div className={styles.info}>
          <div className={styles.yearMonth}>{selectDate.format("D MMMM")}</div>
          {selectDate.isSame(moment(), "day") ? (
            <div className={styles.today}>Today</div>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className={styles.bodyContainer}>
        <div className={styles.weekTimeGridContainer}>
          <WeekCalendar
            key={selectDate.format("YYYYMMDD")}
            evetDb={events}
            selectDate={selectDate}
            addNewEvent={addNewEvent}
            updateEvent={updateEvent}
          />
        </div>
        <div className={styles.calendar}>
          <SmallCalendar
            setSelectDate={handleSetSelectDate}
            selectDate={selectDate}
          />
        </div>
      </div>
    </Card>
  );
}

export default Index;
