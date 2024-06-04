document.getElementById('cv-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const cvFile = document.getElementById('cv-upload').files[0];
    
    if (cvFile) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const cvContent = e.target.result;
        
        // Mock API call to analyze CV and find a suitable mentor
        const mentor = findMentor(cvContent);
        
        document.getElementById('result').innerText = `Suitable Mentor: ${mentor.name}, Expertise: ${mentor.expertise}`;
      };
      reader.readAsText(cvFile);
    } else {
      alert('Please upload a CV.');
    }
  });
  
  function findMentor(cvContent) {
    // Mock AI analysis to find a suitable mentor based on the CV content
    // In a real application, this would involve sending the CV to a backend server
    // which would analyze it using AI/ML models.
    
    // For simplicity, we'll return a mock mentor.
    return {
      name: 'Jane Doe',
      expertise: 'Software Engineering'
    };
  }
  