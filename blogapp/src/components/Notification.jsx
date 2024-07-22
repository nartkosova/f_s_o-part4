const Notification = ({ message, isError }) => {
  if (message === null) {
    return null;
  }

  const notificationStyle = {
    color: isError ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  );
};

export default Notification;
