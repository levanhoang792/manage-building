import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Door, DoorFormData, DoorQueryParams, useCreateDoor, useDeleteDoor, useGetDoors} from '@/hooks/doors';
import DoorList from './components/DoorList';
import DoorForm from './components/DoorForm';
import DoorFilter from './components/DoorFilter';
import Pagination from '@/components/commons/Pagination';
import {PlusIcon} from '@heroicons/react/24/outline';
import {useGetFloorDetail} from '@/hooks/floors';
import {useGetBuildingDetail} from '@/hooks/buildings';

export const DoorManagement: React.FC = () => {
    const {id, floorId} = useParams<{ id: string; floorId: string }>();
    const navigate = useNavigate();

    const generateDoorHtml = (door: Door, buildingId: string, floorId: string) => {
        const apiUrl = 'http://localhost:3000/api/door-requests';
        return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Yêu cầu truy cập cửa ${door.name}</title>
    <style>
        body { font-family: sans-serif; padding: 20px; max-width: 600px; margin: auto; }
        label { display: block; margin-top: 10px; }
        input, textarea { width: 100%; padding: 8px; margin-top: 4px; }
        button { margin-top: 20px; padding: 10px 20px; font-size: 16px; }
        #result { margin-top: 15px; font-weight: bold; }
    </style>
</head>
<body>
    <h1>Yêu cầu truy cập cửa: ${door.name}</h1>
    <p><strong>Toà nhà:</strong> ${buildingId} | <strong>Tầng:</strong> ${floorId}</p>
    <form id="door-access-form">
        <label>Họ tên người yêu cầu
            <input type="text" name="requester_name" required />
        </label>
        <label>Số điện thoại
            <input type="text" name="requester_phone" required />
        </label>
        <label>Email (không bắt buộc)
            <input type="email" name="requester_email" />
        </label>
        <label>Lý do truy cập
            <textarea name="purpose" rows="3" required></textarea>
        </label>
        <button type="submit" id="submit-btn">Gửi yêu cầu</button>
    </form>
    <div id="result"></div>

    <script>
        // Thiết lập mặc định nội dung lý do
        window.addEventListener('DOMContentLoaded', () => {
            const textarea = document.querySelector('textarea[name="purpose"]');
            const now = new Date();
            const pad = (n) => n.toString().padStart(2, '0');
            const timeStr = \`\${pad(now.getHours())}:\${pad(now.getMinutes())} \${pad(now.getDate())}/\${pad(now.getMonth()+1)}/\${now.getFullYear()}\`;
            textarea.value = "Yêu cầu mở cửa ${door.name}. Thời gian " + timeStr;
        });

        const form = document.getElementById('door-access-form');
        const submitBtn = document.getElementById('submit-btn');
        const resultDiv = document.getElementById('result');

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            submitBtn.disabled = true;
            submitBtn.textContent = 'Đang gửi...';
            resultDiv.textContent = '';

            const data = {
                door_id: ${door.id},
                requester_name: form.requester_name.value,
                requester_phone: form.requester_phone.value,
                requester_email: form.requester_email.value,
                purpose: form.purpose.value
            };

            try {
                const response = await fetch('${apiUrl}', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                if (response.ok) {
                    resultDiv.innerText = '✔️ Yêu cầu thành công!';
                    setTimeout(() => window.close(), 1500);
                } else {
                    resultDiv.innerText = '❌ Lỗi: ' + (result.message || 'Không xác định');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Gửi yêu cầu';
                }
            } catch (error) {
                resultDiv.innerText = '❌ Lỗi khi gửi yêu cầu: ' + error.message;
                submitBtn.disabled = false;
                submitBtn.textContent = 'Gửi yêu cầu';
            }
        });
    </script>
</body>
</html>`;
    };

    const generateDoorScript = (door: Door, buildingId: string, floorId: string) => {
        return `#!/usr/bin/env node
/**
 * Door Control Script
 * Door ID: ${door.id}
 * Door Name: ${door.name}
 * Building ID: ${buildingId}
 * Floor ID: ${floorId}
 *
 * Hướng dẫn sử dụng:
 * 1. Cài đặt Node.js phiên bản >= 18 từ https://nodejs.org/
 * 2. Script này sẽ tự động sử dụng access token của thiết bị
 * 3. Chạy script: node door_${door.id}_control.js và làm theo hướng dẫn
 */

const THINGSBOARD_URL = 'https://thingsboard.cloud'; // URL của ThingsBoard Cloud
const DEVICE_TOKEN = '${door.thingsboard_access_token}'; // Access token của thiết bị
const DOOR_ID = ${door.id};
const DOOR_NAME = '${door.name}';
const CURRENT_LOCK_STATUS = '${door.lock_status}';

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Hàm tạo thanh tiến trình
function createProgressBar(length) {
    let current = 0;
    const total = length;
    const progressChar = '█';
    const emptyChar = '░';
    let intervalId = null;
    
    return {
        start() {
            current = Math.floor(total * 0.1);
            this.draw();
            intervalId = setInterval(() => {
                if (current < Math.floor(total * 0.9)) {
                    current++;
                    this.draw();
                }
            }, 200);
        },
        draw() {
            const percentage = Math.floor((current / total) * 100);
            const filled = Math.floor((current / total) * length);
            const empty = length - filled;
            const bar = progressChar.repeat(filled) + emptyChar.repeat(empty);
            process.stdout.write(\`\\r[\${bar}] \${percentage}%\`);
        },
        complete() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            current = total;
            this.draw();
            process.stdout.write('\\n');
        },
        stop() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        }
    };
}

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, (answer) => {
            resolve(answer);
        });
    });
}

async function checkCurrentDoorStatus() {
    try {
        console.log('\\n📡 Đang kiểm tra trạng thái cửa từ ThingsBoard...');
        
        const response = await fetch(\`\${THINGSBOARD_URL}/api/v1/\${DEVICE_TOKEN}/attributes\`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(\`Lỗi khi lấy trạng thái cửa: [\${response.status}] \${response.statusText}\`);
        }

        const data = await response.json();
        // Lấy trạng thái từ last_request trong client attributes
        const currentStatus = data?.client?.last_request?.lock_status || CURRENT_LOCK_STATUS;
        console.log('\\n📊 Trạng thái cửa hiện tại:', currentStatus);
        console.log('\\n📝 Thông tin yêu cầu gần nhất:', data?.client?.last_request || 'Chưa có yêu cầu nào');
        return currentStatus;
    } catch (error) {
        console.error('\\n❌ Lỗi khi kiểm tra trạng thái cửa:', error.message);
        console.log('\\n⚠️ Sử dụng trạng thái mặc định:', CURRENT_LOCK_STATUS);
        return CURRENT_LOCK_STATUS;
    }
}

async function sendToThingsBoard(requesterName, requesterPhone, requesterEmail = '', purpose) {
    const progressBar = createProgressBar(30);
    
    try {
        // Kiểm tra trạng thái cửa hiện tại từ ThingsBoard
        const currentStatus = await checkCurrentDoorStatus();
        
        console.log('\\n📡 Đang gửi yêu cầu đến ThingsBoard...');
        progressBar.start();

        // Đảo trạng thái khóa dựa trên trạng thái thực tế từ ThingsBoard
        const newLockStatus = currentStatus === 'closed' ? 'open' : 'closed';

        // Chuẩn bị dữ liệu telemetry
        const telemetryData = {
            ts: Date.now(),
            door_id: DOOR_ID,
            requester_name: requesterName,
            requester_phone: requesterPhone,
            requester_email: requesterEmail,
            purpose: purpose,
            request_type: 'access',
            status: 'pending',
            lock_status: newLockStatus
        };

        // Gửi telemetry data
        const telemetryResponse = await fetch(\`\${THINGSBOARD_URL}/api/v1/\${DEVICE_TOKEN}/telemetry\`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(telemetryData)
        });

        if (!telemetryResponse.ok) {
            throw new Error(\`Lỗi khi gửi telemetry: [\${telemetryResponse.status}] \${await telemetryResponse.text()}\`);
        }

        // Chuẩn bị dữ liệu attributes
        const attributesData = {
            last_request: {
                door_id: DOOR_ID,
                requester_name: requesterName,
                requester_phone: requesterPhone,
                requester_email: requesterEmail,
                purpose: purpose,
                timestamp: new Date().toISOString(),
                lock_status: newLockStatus
            }
        };

        // Cập nhật attributes
        const attributesResponse = await fetch(\`\${THINGSBOARD_URL}/api/v1/\${DEVICE_TOKEN}/attributes\`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(attributesData)
        });

        if (!attributesResponse.ok) {
            throw new Error(\`Lỗi khi cập nhật attributes: [\${attributesResponse.status}] \${await attributesResponse.text()}\`);
        }

        progressBar.complete();
        
        console.log('\\n✅ Yêu cầu đã được gửi thành công đến ThingsBoard!');
        console.log('📝 Chi tiết yêu cầu:');
        console.log('   - Cửa:', DOOR_NAME);
        console.log('   - Thay đổi trạng thái:', \`\${currentStatus} → \${newLockStatus}\`);
        console.log('   - Thời gian:', new Date().toLocaleString('vi-VN'));
        console.log('   - Người yêu cầu:', requesterName);
        console.log('   - Số điện thoại:', requesterPhone);
        if (requesterEmail) console.log('   - Email:', requesterEmail);
        console.log('   - Lý do:', purpose);
        console.log('\\n📱 Bạn sẽ nhận được thông báo khi yêu cầu được phê duyệt.');
        
        return true;
    } catch (error) {
        progressBar.stop();
        console.error('\\n❌ Lỗi xử lý yêu cầu:');
        console.error(\`   \${error.message}\`);
        
        // Log thông tin debug
        console.error('\\n🔍 Thông tin debug:');
        console.error(\`   URL: \${THINGSBOARD_URL}\`);
        console.error(\`   Door ID: \${DOOR_ID}\`);
        console.error(\`   Device Token length: \${DEVICE_TOKEN ? DEVICE_TOKEN.length : 0}\`);
        
        throw error;
    }
}

async function main() {
    console.log('╔════════════════════════════════════════╗');
    console.log(\`║  Yêu cầu truy cập cửa: \${DOOR_NAME.padEnd(16)}║\`);
    console.log('╚════════════════════════════════════════╝\\n');
    
    if (!DEVICE_TOKEN) {
        console.error('❌ Lỗi: Thiết bị chưa được cấu hình access token trên ThingsBoard');
        rl.close();
        return;
    }

    try {
        const requesterName = await question('👤 Nhập tên người yêu cầu: ');
        if (!requesterName.trim()) {
            throw new Error('Tên không được để trống');
        }

        const requesterPhone = await question('📱 Nhập số điện thoại: ');
        if (!requesterPhone.trim()) {
            throw new Error('Số điện thoại không được để trống');
        }

        const requesterEmail = await question('📧 Nhập email (có thể bỏ qua bằng cách nhấn Enter): ');

        const purpose = await question('📝 Nhập lý do truy cập: ');
        if (!purpose.trim()) {
            throw new Error('Lý do không được để trống');
        }

        await sendToThingsBoard(requesterName, requesterPhone, requesterEmail, purpose);
    } catch (error) {
        console.error('\\n❌ Lỗi:', error.message);
    } finally {
        rl.close();
    }
}

main();`;
    };

    const handleDownloadScript = (door: Door) => {
        if (!id || !floorId) return;
        const script = generateDoorScript(door, id, floorId);
        const blob = new Blob([script], {type: 'text/javascript'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `door_${door.id}_control.js`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDownloadHtml = (door: Door) => {
        if (!id || !floorId) return;
        const htmlContent = generateDoorHtml(door, id, floorId);
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `door_${door.id}_access_form.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Kiểm tra nếu không có id hoặc floorId, chuyển hướng về trang buildings
    useEffect(() => {
        if (!id || !floorId) {
            navigate('/buildings');
        }
    }, [id, floorId, navigate]);

    const [filters, setFilters] = useState<DoorQueryParams>({
        page: 1,
        limit: 10,
        search: '',
        type: '',
        status: '',
        sortBy: 'created_at',
        sortOrder: 'desc'
    });

    const [isFormOpen, setIsFormOpen] = useState(false);

    // Fetch data chỉ khi có id và floorId
    const {data: doorsData, isLoading: isLoadingDoors, refetch: refetchDoors} =
        useGetDoors(id || undefined, floorId || undefined, filters);
    const {data: floorData, isLoading: isLoadingFloor} =
        useGetFloorDetail(id || '0', floorId || '0');
    const {data: buildingData, isLoading: isLoadingBuilding} =
        useGetBuildingDetail(id || '0');

    // Mutations
    const createDoorMutation = useCreateDoor(id || '0', floorId || '0');
    const deleteDoorMutation = useDeleteDoor(id || '0', floorId || '0');

    // Refetch when filters change
    useEffect(() => {
        refetchDoors().then(r => r);
    }, [filters, refetchDoors]);

    // Listen for door:create event
    useEffect(() => {
        const handleCreateEvent = () => setIsFormOpen(true);
        window.addEventListener('door:create', handleCreateEvent);
        return () => {
            window.removeEventListener('door:create', handleCreateEvent);
        };
    }, []);

    const handleFilterChange = (newFilters: DoorQueryParams) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
            page: 1 // Reset to first page when filters change
        }));
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({
            ...prev,
            page
        }));
    };

    const handleCreateDoor = async (data: DoorFormData) => {
        try {
            await createDoorMutation.mutateAsync(data);
            setIsFormOpen(false);
            refetchDoors();
        } catch (error) {
            console.error('Error creating door:', error);
        }
    };

    const handleDeleteDoor = async (id: number) => {
        try {
            await deleteDoorMutation.mutateAsync(id);
            refetchDoors();
        } catch (error) {
            console.error('Error deleting door:', error);
        }
    };

    const handleEditDoor = (door: Door) => {
        // Thêm tham số returnTo để quay về trang danh sách cửa sau khi chỉnh sửa
        const currentPath = `/buildings/${id}/floors/${floorId}/doors`;
        const encodedReturnTo = encodeURIComponent(currentPath);
        navigate(`/buildings/${id}/floors/${floorId}/doors/edit/${door.id}?returnTo=${encodedReturnTo}`);
    };

    const handleViewDoor = (door: Door) => {
        navigate(`/buildings/${id}/floors/${floorId}/doors/${door.id}`);
    };

    const isLoading = isLoadingDoors || isLoadingFloor || isLoadingBuilding;
    const doors = doorsData?.data?.data || [];
    const totalItems = doorsData?.data?.total || 0;
    const totalPages = Math.ceil(totalItems / filters.limit!);

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý cửa</h1>
                        {!isLoading && (
                            <p className="mt-1 text-sm text-gray-500">
                                Tòa nhà: {buildingData?.data?.name} | Tầng: {floorData?.data?.name}
                            </p>
                        )}
                    </div>
                    <div className="mt-4 md:mt-0">
                        <button
                            type="button"
                            onClick={() => {
                                // Chuyển đến trang tạo cửa mới với tham số returnTo
                                const currentPath = `/buildings/${id}/floors/${floorId}/doors`;
                                const encodedReturnTo = encodeURIComponent(currentPath);
                                navigate(`/buildings/${id}/floors/${floorId}/doors/create?returnTo=${encodedReturnTo}`);
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
                            Thêm cửa mới
                        </button>
                    </div>
                </div>
            </div>

            <DoorFilter onFilterChange={handleFilterChange} initialFilters={filters}/>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <DoorList
                    doors={doors}
                    onEdit={handleEditDoor}
                    onDelete={handleDeleteDoor}
                    onView={handleViewDoor}
                    onDownloadScript={(door) => {
                        handleDownloadHtml(door);
                        handleDownloadScript(door);
                    }}
                    isLoading={isLoading}
                />

                {totalPages > 1 && (
                    <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <Pagination
                            currentPage={filters.page || 1}
                            totalPage={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>

            <DoorForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleCreateDoor}
                isSubmitting={createDoorMutation.isPending}
                error={createDoorMutation.error?.message}
            />
        </div>
    );
};

export default DoorManagement;

















