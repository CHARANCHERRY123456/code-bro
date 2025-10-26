"use client"
export default function AuthError({ error }) {
    return (
        <div>
            <h1>Authentication Error</h1>
            <p>{error}</p>
        </div>
    );
}