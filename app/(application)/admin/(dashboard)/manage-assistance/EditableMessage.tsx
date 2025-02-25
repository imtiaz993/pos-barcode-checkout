import React, { useState } from "react";

const EditableMessage = ({ chat }: any) => {
  const [message, setMessage] = useState(chat.text);
  return (
    <textarea
      className="px-3 sm:px-2 py-1 resize-none border w-full outline-none"
      value={message}
      onChange={(e) => {
        setMessage(e.target.value);
      }}
      rows={3}
    />
  );
};

export default EditableMessage;
