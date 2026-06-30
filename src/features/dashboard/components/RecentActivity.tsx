export function RecentActivity(){
    const items = Array.from({ length: 5});

    return(
        <div style={{background:'#fffffff', borderRadius:'16px', padding: '1.5rem', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', flex:1}}>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                {items.map((_, i)=>(
                    <div key={i} style={{height:'52px', borderRadius:'10px', background:'#e8e8e8', animation:'pulse 1.5s ease-in-out infinite'}}/>
                ))}
            </div>
        </div>
    )
}