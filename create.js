document.getElementById('createForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const staff = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      age: parseInt(document.getElementById('age').value),
      special: document.getElementById('special').value.trim(),
      price: parseFloat(document.getElementById('price').value),
      description: document.getElementById('description').value.trim()
    };
  
    try {
      const res = await fetch('http://localhost:3000/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staff)
      });
  
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        document.getElementById('createForm').reset();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (err) {
      alert('Something went wrong while adding the staff member.');
      console.error(err);
    }
  });
  
