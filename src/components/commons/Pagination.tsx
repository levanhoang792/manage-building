import {cn} from "@/lib/utils";
import styles from "@/global.module.scss";
import {
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/20/solid";
import {Button} from "@headlessui/react";
import {useRef} from "react";

type PaginationProps = {
    currentPage: number;
    totalPage: number;
    onPageChange: (page: number) => void;
};

// Bỏ het async di
function Pagination({currentPage, totalPage, onPageChange}: PaginationProps) {
    const onPageChangeRef = useRef(onPageChange || (() => {}));

    const PaginationButton = ({page}: {page: number}) =>
        page === currentPage ? (
            <Button className={cn(styles.paginationItem, styles.paginationItemActive)}>{page}</Button>
        ) : (
            <Button
                onClick={() => {
                    onPageChangeRef.current(page);
                }}
                className={cn(styles.paginationItem)}
            >
                {page}
            </Button>
        );

    const PaginationEllipsis = () => (
        <Button className={cn(styles.paginationItem, styles.paginationItemChevronDisabled)} disabled>
            ...
        </Button>
    );

    // Xây dựng danh sách số trang cần hiển thị
    const paginationItems = [];

    // Nếu đang ở trang đầu (hiển thị 1 2 3 ...)
    if (currentPage <= 2) {
        for (let i = 1; i <= Math.min(3, totalPage); i++) {
            paginationItems.push(<PaginationButton key={i} page={i} />);
        }
        if (totalPage > 3) {
            paginationItems.push(<PaginationEllipsis key="end-ellipsis" />);
        }
    } else if (currentPage >= totalPage - 1) {
        // Nếu đang ở trang cuối (hiển thị ... totalPage-2 totalPage-1 totalPage)
        if (totalPage > 3) {
            paginationItems.push(<PaginationEllipsis key="start-ellipsis" />);
        }
        for (let i = Math.max(1, totalPage - 2); i <= totalPage; i++) {
            paginationItems.push(<PaginationButton key={i} page={i} />);
        }
    } else {
        // Nếu ở giữa (hiển thị ... prev current next ...)
        paginationItems.push(<PaginationEllipsis key="start-ellipsis" />);

        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            paginationItems.push(<PaginationButton key={i} page={i} />);
        }

        paginationItems.push(<PaginationEllipsis key="end-ellipsis" />);
    }

    return (
        <div className={cn("flex justify-end gap-4")}>
            <Button
                className={cn(styles.paginationItem, styles.paginationItemChevron, "hover:cursor-pointer", {
                    [styles.paginationItemChevronDisabled]: currentPage === 1,
                })}
                onClick={() => {
                    onPageChangeRef.current(1);
                }}
            >
                <ChevronDoubleLeftIcon className={cn("size-4")} />
            </Button>
            <Button
                className={cn(styles.paginationItem, styles.paginationItemChevron, "hover:cursor-pointer", {
                    [styles.paginationItemChevronDisabled]: currentPage === 1,
                })}
                onClick={() => {
                    onPageChangeRef.current(Math.max(1, currentPage - 1));
                }}
            >
                <ChevronLeftIcon className={cn("size-4")} />
            </Button>

            {paginationItems}

            <Button
                className={cn(styles.paginationItem, styles.paginationItemChevron, "hover:cursor-pointer", {
                    [styles.paginationItemChevronDisabled]: currentPage === totalPage,
                })}
                onClick={() => {
                    onPageChangeRef.current(Math.min(totalPage, currentPage + 1));
                }}
            >
                <ChevronRightIcon className={cn("size-4")} />
            </Button>
            <Button
                className={cn(styles.paginationItem, styles.paginationItemChevron, "hover:cursor-pointer", {
                    [styles.paginationItemChevronDisabled]: currentPage === totalPage,
                })}
                onClick={() => {
                    onPageChangeRef.current(totalPage);
                }}
            >
                <ChevronDoubleRightIcon className={cn("size-4")} />
            </Button>
        </div>
    );
}

export default Pagination;
