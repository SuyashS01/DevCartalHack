// /client/src/pages/login.js

// const Login = () => {
//   return (
//     <div style={{ textAlign: "center", padding: "50px" }}>
//       <h2>Login with GitHub</h2>
//       <a href="http://localhost:4000/auth/github">
//         <button style={{
//           padding: "10px 20px",
//           fontSize: "16px",
//           backgroundColor: "#24292e",
//           color: "#fff",
//           border: "none",
//           borderRadius: "5px",
//           cursor: "pointer"
//         }}>
//           Login with GitHub
//         </button>
//       </a>
//     </div>
//   );
// };

// export default Login;

import { useState } from 'react';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    window.location.href = "http://localhost:4000/auth/github";
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        padding: '2.5rem',
        maxWidth: '420px',
        width: '100%',
        textAlign: 'center',
        transition: 'transform 0.3s ease',
        ':hover': {
          transform: 'translateY(-5px)'
        }
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <svg height="48" viewBox="0 0 16 16" width="48" fill="#24292e">
            <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
          </svg>
          <h1 style={{
            margin: '1rem 0 0.5rem',
            fontSize: '24px',
            fontWeight: '600',
            color: '#24292e'
          }}>
            Sign in to GitHub
          </h1>
          <p style={{
            color: '#586069',
            fontSize: '14px',
            marginBottom: '1.5rem'
          }}>
            Join the world's largest developer platform
          </p>
        </div>

        <button
          onClick={handleClick}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '14px',
            fontWeight: '600',
            backgroundColor: '#2ea44f',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            ':hover': {
              backgroundColor: '#2c974b',
              boxShadow: '0 5px 15px rgba(46, 164, 79, 0.4)'
            }
          }}
        >
          {isLoading ? (
            <>
              <svg width="18" height="18" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff">
                <g fill="none" fillRule="evenodd">
                  <g transform="translate(1 1)" strokeWidth="2">
                    <circle strokeOpacity=".5" cx="18" cy="18" r="18"/>
                    <path d="M36 18c0-9.94-8.06-18-18-18">
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 18 18"
                        to="360 18 18"
                        dur="1s"
                        repeatCount="indefinite"/>
                    </path>
                  </g>
                </g>
              </svg>
              Authenticating...
            </>
          ) : (
            <>
              <svg height="20" viewBox="0 0 16 16" width="20" fill="white">
                <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
              Sign in with GitHub
            </>
          )}
        </button>

        <div style={{
          marginTop: '1.5rem',
          fontSize: '12px',
          color: '#586069',
          lineHeight: '1.5'
        }}>
          By signing in, you agree to our 
          <button 
            style={{ 
              color: '#0366d6', 
              background: 'none', 
              border: 'none', 
              padding: '0 4px', 
              cursor: 'pointer',
              fontSize: '12px'
            }}
            onClick={() => window.open('https://docs.github.com/en/site-policy/github-terms/github-terms-of-service', '_blank')}
          >
            Terms of Service
          </button> 
          and 
          <button 
            style={{ 
              color: '#0366d6', 
              background: 'none', 
              border: 'none', 
              padding: '0 4px', 
              cursor: 'pointer',
              fontSize: '12px'
            }}
            onClick={() => window.open('https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement', '_blank')}
          >
            Privacy Policy
          </button>.
        </div>
      </div>

      {/* Static Octocat decoration */}
      <div style={{
        position: 'fixed',
        bottom: '40px',
        right: '40px',
        zIndex: 0,
        opacity: 0.1
      }}>
        <svg width="80" height="80" viewBox="0 0 250 250" fill="#24292e">
          <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
          <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor"></path>
          <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor"></path>
        </svg>
      </div>
    </div>
  );
};

export default Login;