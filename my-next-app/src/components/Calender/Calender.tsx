// components/Calendar.tsx
import React, { useState, ChangeEvent, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// Define types for state and props
type Messages = { [key: string]: string };

interface UserCalenderProps {
  initialDate: Date;
  onClose: () => void;
}

export const UserCalender: React.FC<UserCalenderProps> = ({
  initialDate,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClose,
}) => {
  const [messages, setMessages] = useState<Messages>({});
  const [message, setMessage] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

  useEffect(() => {
    setSelectedDate(initialDate);
  }, [initialDate]);

  const addMessage = () => {
    const newMessages = {
      ...messages,
      [selectedDate.toISOString().substr(0, 10)]: message,
    };

    setMessages(newMessages); // Update state with new messages
    localStorage.setItem("Messages", JSON.stringify(newMessages)); // Update localStorage
  };

  return (
    <section className='app'>
      <div className='calendar-container'>
        <Calendar
          value={selectedDate}
          onClickDay={(date: Date) => setSelectedDate(date)}
          tileContent={({ date }) => {
            const message = messages[date.toISOString().substr(0, 10)];
            return message ? <p className='message'>{message}</p> : null;
          }}
        />
      </div>
      <div className='input'>
        <input
          className='inputmain'
          type='text'
          placeholder='Message'
          value={message}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setMessage(e.target.value)
          }
        />
        <button onClick={addMessage}>Add Message</button>
      </div>
    </section>
  );
};
export default UserCalender;
