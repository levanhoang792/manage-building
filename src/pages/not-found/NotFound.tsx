import styles from './NotFound.module.scss';

function NotFound() {
    return (
        <div className={styles.notFoundContainer}>
            <h1 className={styles.notFoundTitle}>404</h1>
            <p className={styles.notFoundMessage}>Oops! The page you are looking for does not exist.</p>
            <a href="/" className={styles.notFoundLink}>Go back to Home</a>
        </div>
    );
}

export default NotFound;