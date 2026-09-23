import Request from "../../core/request";

export const getNotifications = (page = 1, limit = 30) => Request({
    param: "/notifications",
    method: "GET",
    args: { page, limit },
});

export const markNotificationAsRead = (notificationId) => Request({
    param: `/notifications/${notificationId}/read`,
    method: "PATCH",
    args: {},
});

export default getNotifications;
