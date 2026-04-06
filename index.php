
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />

    <script src="https://kit.fontawesome.com/f1f723bf20.js" crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <link rel="stylesheet" href="style.css" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap" rel="stylesheet">
    <link rel="icon" type="image/x-icon" href="Images/LOGO.png" />
    <link rel="manifest" href="manifest.json" />
    <meta name="theme-color" content="#f39d2d" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <link rel="stylesheet" href="index_style.css">
    <title>BeanBoard</title>
</head>

<body>
<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>

<div class="navbar-fixed">
    <nav>
        <div class="container nav-wrapper">
            <a href="#!" class="brand-logo" style="display: flex; align-items: center; height: 55px;"> 
                <img src="Images/LOGO.png" alt="Logo" class="hide-on-large-only">
                <span class="hide-on-med-and-down navbar-kimi">BeanBoard</span>
            </a>
            <ul class="right hide-on-med-and-down">
                <li><a href="">About Us</a></li>
            </ul>
        </div>
    </nav>
</div>

<main style="flex:1; display:flex;">
    <div class="row" style="flex:1; margin:0; display:flex; width:100%;">

        <div class="col s12 m6 hide-on-med-and-down" style="height:100%;"></div>

        <div class="col s12 m6" style="display:flex; align-items:center; justify-content:center; height:100%;">
            <div class="login-card">

                <div class="logo-container">
                    <img src="Images/LOGO.png" alt="KIMI Logo" class="logo">
                    <h5 class="login-title">
                        <span class="cursive-text">Welcome to, </span> BeanBoard
                    </h5>
                </div>

                <form action="" method="POST">
                    <div class="usercon">
                        <input type="text" name="username" id="username" class="usernamefield" placeholder="Username" required>
                    </div>

                    <div class="passcon">
                        <input type="password" name="password" id="password" class="passwordfield" placeholder="Password" required>
                        <button type="button" class="toggle-btn" onclick="togglePassword()">
                            <i id="toggleIcon" class="fa-solid fa-eye"></i>
                        </button>
                    </div>

                    <button type="submit" class="btnlogin">LOG IN</button>
                </form>

            </div>
        </div>

    </div>
</main>

<script>
function togglePassword(){
    const password=document.getElementById("password");
    const icon=document.getElementById("toggleIcon");

    if(password.type==="password"){
        password.type="text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    }else{
        password.type="password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}
</script>

<script>
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered', reg))
            .catch(err => console.log('Service Worker registration failed', err));
    });
}
</script>

</body>
</html>