export default function Notification({ message }) {
    return <>{message ? <div>{message}</div> : null}</>
}
