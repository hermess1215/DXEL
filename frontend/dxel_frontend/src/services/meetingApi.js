const BASE_URL = 'http://127.0.0.1:8000'

export async function fetchMeetingList(keyword = '', searchType = 'title') {
    const params = new URLSearchParams()

    if(keyword) {
        params.append('keyword', keyword)
        params.append('search_type', searchType)
    }

    const response = await fetch(`${BASE_URL}/meetings?${params.toString()}`)

    return response.json()
}

export async function fetchMeetingDetail(meetingId) {
    const response = await fetch(`${BASE_URL}/meetings/${meetingId}`)

    return response.json()
}

export async function updateParticipants(meetingId, participants) {
    const response = await fetch(`${BASE_URL}/meetings/${meetingId}/participants`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ participants })
    })

    return response.json()
}

export async function uploadFile(file, force=false) {
    const formData = new FormData()

    const freshFile = new File([file], file.name, { type: file.type })
    formData.append('file', freshFile)

    const url = force ? `${BASE_URL}/upload?force=true` : `${BASE_URL}/upload`

    const response = await fetch(url, {
        method: 'POST',
        body: formData
    })

    return response.json()
}

export async function fetchJobStatus(jobId) {
    const response = await fetch(`${BASE_URL}/jobs/${jobId}`)

    return response.json()
}

export function exportUrl(meetingId) {
    return `${BASE_URL}/export/${meetingId}`
}