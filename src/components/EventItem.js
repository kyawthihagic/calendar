import { Card, DatePicker, Form, Input, Modal, TimePicker } from "antd";
import moment from "moment";
import { useState } from "react";
import styles from "./EventItem.module.css";
import styled, { css } from "styled-components";

export const top = (startMinute) => {
  return startMinute * 1.6 - 450 * 1.6 + "px";
};

const height = (startMinute, endMinute) => {
  return (endMinute - startMinute) * 1.6 + "px";
};

const EventIndicator = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &::before {
    content: "";
    position: absolute;
    height: 100%;
    width: 5px;
    top: 0;
    left: -7px;
    border-radius: 4px;
    ${(props) =>
      props.color &&
      css`
        background-color: ${props.color};
      `}
  }
`;

function EventItem({ event, updateEvent }) {
  const [isModalVisible, setIsModalVisible] = useState(event.type === "new");
  const [form] = Form.useForm();

  const { color } = event;

  const isPast = moment(event.end).isBefore(moment());

  const startMinute = moment
    .duration(moment(event.start).format("HH:mm"))
    .asMinutes();
  const endMinute = moment
    .duration(moment(event.end).format("HH:mm"))
    .asMinutes();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    updateEvent({
      ...event,
      type: null,
    });
    setIsModalVisible(false);
  };

  const onFinish = (values) => {
    updateEvent({
      ...event,
      title: values.title,
      start: values.rangeTime[0].toISOString(),
      end: values.rangeTime[1].toISOString(),
      name: values.name,
      type: null,
    });
    setIsModalVisible(false);
  };

  return (
    <>
      <Modal
        title="Add Event"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form onFinish={onFinish} form={form} autoComplete="off">
          <Form.Item initialValue={event.title} name="title">
            <Input placeholder="Add  Title" />
          </Form.Item>
          <Form.Item initialValue={event.name} name="name">
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item
            name="rangeTime"
            initialValue={[
              event.start && moment(event.start),
              event.end && moment(event.end),
            ]}
          >
            <TimePicker.RangePicker />
          </Form.Item>
        </Form>
      </Modal>
      <div
        tabIndex={0}
        className={`${styles.event} ${isPast ? styles.isPast : ""}`}
        style={{
          top: top(startMinute),
          height: height(startMinute, endMinute),
          backgroundColor: color.card,
          borderColor: color.card,
        }}
        onClick={showModal}
      >
        <EventIndicator
          className={styles.eventIndicator}
          color={color.indicator}
        >
          <div>
            <h5
              className={styles.lineCamp3}
              style={{ color: color.title, textDecorationColor: color.title }}
            >
              {event.title || "(No Title)"}
            </h5>
            <h5
              className={styles.lineCamp2}
              style={{ color: color.name, textDecorationColor: color.name }}
            >
              {event.name || ""}
            </h5>
          </div>
          <p style={{ color: color.time, textDecorationColor: color.time }}>
            {moment(event.start).format("hh:mm A")} -
            {moment(event.end).format("hh:mm A")}
          </p>
        </EventIndicator>
      </div>
    </>
  );
}

export default EventItem;
