import { useFloating, offset, shift, flip, inline, type Placement } from '@floating-ui/react';
import { useState } from 'react';

interface DoorTooltipProps {
    children: React.ReactNode;
    content: React.ReactNode;
    placement?: Placement;
}

export default function DoorTooltip({ children, content, placement = 'top' }: DoorTooltipProps) {
    const [isOpen, setIsOpen] = useState(false);
    
    const { x, y, strategy, refs, placement: computedPlacement } = useFloating({
        placement,
        middleware: [
            // Điều chỉnh offset dựa trên vị trí hiển thị
            offset(({ placement }) => {
                // Giảm khoảng cách cho tooltip hiển thị ở dưới
                if (placement.startsWith('bottom')) return { mainAxis: 5, crossAxis: 0 };
                // Giữ nguyên khoảng cách cho các vị trí khác
                if (placement.startsWith('top')) return { mainAxis: 10, crossAxis: 0 };
                if (placement.startsWith('left')) return { mainAxis: 10, crossAxis: 0 };
                if (placement.startsWith('right')) return { mainAxis: 10, crossAxis: 0 };
                return 10; // fallback
            }),
            inline(),
            shift({ padding: 8 }),
            flip()
        ]
    });

    // Lấy vị trí hiển thị thực tế để điều chỉnh style
    const currentPosition = computedPlacement.split('-')[0];

    return (
        <>
            <div 
                ref={refs.setReference}
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                style={{ display: 'inline-block', position: 'relative' }}
            >
                {children}
            </div>
            {isOpen && (
                <div
                    ref={refs.setFloating}
                    style={{
                        position: strategy,
                        top: y ?? 0,
                        left: x ?? 0,
                        zIndex: 9999,
                        pointerEvents: 'none',
                    }}
                >
                    <div 
                        className="bg-black/75 text-white p-2 rounded-md text-sm min-w-[200px]"
                        style={{
                            // Giảm margin cho tooltip hiển thị ở dưới
                            marginTop: currentPosition === 'bottom' ? '2px' : undefined,
                            marginBottom: currentPosition === 'top' ? '5px' : undefined,
                            marginLeft: currentPosition === 'right' ? '5px' : undefined,
                            marginRight: currentPosition === 'left' ? '5px' : undefined,
                        }}
                    >
                        {content}
                    </div>
                </div>
            )}
        </>
    );
}