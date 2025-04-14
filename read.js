document.getElementById('searchForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const email = document.getElementById('emailInput').value.trim();
  
    try {
      const res = await fetch(`http://localhost:3000/api/staff/${email}`);
      const data = await res.json();
  
      const resultDiv = document.getElementById('resultContainer');
      if (res.ok) {
        resultDiv.innerHTML = `
          <strong>Name:</strong> ${data.name}<br>
          <strong>Email:</strong> ${data.email}<br>
          <strong>Phone:</strong> ${data.phone}<br>
          <strong>Age:</strong> ${data.age}<br>
          <strong>Special Items:</strong> ${data.special}<br>
          <strong>Price:</strong> $${data.price}<br>
          <strong>Description:</strong> ${data.description}
        `;
      } else {
        resultDiv.innerHTML = `<span style="color: red;">${data.message}</span>`;
      }
    } catch (err) {
      console.error(err);
      document.getElementById('resultContainer').innerHTML = "Server error. Please try again.";
    }
  });
  
