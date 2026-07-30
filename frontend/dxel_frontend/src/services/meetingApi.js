const BASE_URL = 'http://127.0.0.1:8000'

export async function fetchMeetingList() {
    const response = await fetch(`${BASE_URL}/meetings`)

    return response.json()
}

export async function fetchMeetingDetail(meetingId) {
    const response = await fetch(`${BASE_URL}/meetings/${meetingId}`)

    return response.json()
}

export async function uploadFile(file) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        body: formData
    })

    return response.json()
}

export async function fetchJobStatus(jobId) {
    const response = await fetch(`${BASE_URL}/jobs/${jobId}`)

    return response.json()
}