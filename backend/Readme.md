#  Admin Analytics API Documentation

This document outlines the available Admin Analytics endpoints for monitoring and maintaining user and platform activity.

##  Base URL

```
/v1/admin
```

---

##  GET `/analytics/platform`

Get overall platform usage and analytics statistics.

### Query Parameters:

| Name        | Type     | Description                                               |
| ----------- | -------- | --------------------------------------------------------- |
| `startDate` | `string` | (optional) ISO date to filter from                        |
| `endDate`   | `string` | (optional) ISO date to filter to                          |
| `limit`     | `number` | (optional) Number of top users to return (default: `100`) |

### Response:

```json
{
  "success": true,
  "data": {
    "platformStats": {
      "totalUsers": 100,
      "totalLogins": 450,
      "avgLoginsPerUser": 4.5,
      ...
    },
    "topUsers": [ ... ],
    "browserStats": [ ... ],
    "osStats": [ ... ],
    "recentActivity": [ ... ]
  }
}
```

---

##  GET `/analytics/user/:userId`

Get analytics of a specific user by ID.

### Path Parameters:

| Name     | Type     | Description                    |
| -------- | -------- | ------------------------------ |
| `userId` | `string` | User ID to fetch analytics for |

### Response:

```json
{
  "success": true,
  "data": {
    "analytics": {...},
    "activityLog": [...]
  }
}
```

---

##  GET `/analytics/logins`

Return login trends and distribution.

### Query Parameters:

| Name     | Type     | Description                                                 |
| -------- | -------- | ----------------------------------------------------------- |
| `period` | `string` | (optional) One of `24h`, `7d`, `30d`, `90d` (default: `7d`) |

### Response:

```json
{
  "success": true,
  "data": {
    "period": "7d",
    "dailyLogins": [
      { "_id": {"year":2025,"month":7,"day":11}, "count": 12 },
      ...
    ],
    "loginFrequency": [
      { "_id": 0, "count": 10 },
      { "_id": 1, "count": 35 },
      ...
    ]
  }
}
```

---

##  GET `/analytics/features`

Get the most used features across users.

### Response:

```json
{
  "success": true,
  "data": [
    {
      "_id": "Search",
      "totalUsage": 135,
      "uniqueUsers": 48,
      "lastUsed": "2025-07-10T08:34:12.123Z"
    },
    ...
  ]
}
```

---

##  GET `/analytics/pages`

Get analytics of most visited routes/pages.

### Response:

```json
{
  "success": true,
  "data": [
    {
      "_id": "/dashboard",
      "totalViews": 120,
      "uniqueUsers": 30,
      "lastVisited": "2025-07-10T06:12:45.321Z"
    },
    ...
  ]
}
```

---

##  DELETE `/analytics/clean`

Clean up old logs to maintain DB performance.

### Query Parameters:

| Name   | Type     | Description                                         |
| ------ | -------- | --------------------------------------------------- |
| `days` | `number` | (optional) Number of days to retain (default: `90`) |

### Response:

```json
{
  "success": true,
  "message": "Cleaned 130 logs",
  "deletedCount": 130
}
```

---

##  Notes

* All endpoints return `success: false` and an error message on failure.
* Time filtering assumes `createdAt` or `timestamp` fields are present and indexed.
* For full UI integration, pair this with frontend charting tools like Chart.js, Recharts, or ECharts.

---

Happy hacking! 🛠️
