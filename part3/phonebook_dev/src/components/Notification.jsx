export default function Notification({ message, type = "success" }) {
  if (message === null) {
    return null;
  }

  return <div className={`notification ${type}`}>{message}</div>;
}
