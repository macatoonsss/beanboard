<?php
session_start(); // ✅ MUST be first

include 'db.php';

// Redirect to login if user is not logged in
if (!isset($_SESSION['username'])) {
    header("Location: index.php");
    exit;
}

if (isset($_GET['logout'])) {
    $_SESSION = [];

    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }

    session_destroy();
    header("Location: index.php");
    exit;
}

// Get current logged-in username
$username = $_SESSION['username'];

// ✅ Get FULL user info INCLUDING ID
$stmt = $mysqli->prepare("SELECT id, firstname, lastname, username, image FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

$_SESSION['user_id'] = $user['id'];


// ✅ Now we have the user ID
$currentUserId = $user['id'];

// ✅ COUNT POSTS
$stmt = $mysqli->prepare("SELECT COUNT(*) as total FROM posts WHERE poster = ?");
$stmt->bind_param("i", $currentUserId);
$stmt->execute();
$postResult = $stmt->get_result()->fetch_assoc();
$postCount = $postResult['total'];

// ✅ COUNT FOLLOWERS
$stmt = $mysqli->prepare("SELECT COUNT(*) as total FROM follows WHERE following_id = ?");
$stmt->bind_param("i", $currentUserId);
$stmt->execute();
$followerResult = $stmt->get_result()->fetch_assoc();
$followerCount = $followerResult['total'];

// ✅ COUNT FOLLOWING
$stmt = $mysqli->prepare("SELECT COUNT(*) as total FROM follows WHERE follower_id = ?");
$stmt->bind_param("i", $currentUserId);
$stmt->execute();
$followingResult = $stmt->get_result()->fetch_assoc();
$followingCount = $followingResult['total'];

// Fetch users NOT followed by current user
$stmt = $mysqli->prepare("
    SELECT * FROM users 
    WHERE id != ? 
    AND id NOT IN (
        SELECT following_id 
        FROM follows 
        WHERE follower_id = ?
    )
    LIMIT 3
");
$stmt->bind_param("ii", $currentUserId, $currentUserId);
$stmt->execute();
$user_result = $stmt->get_result();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">

    <script src="https://kit.fontawesome.com/f1f723bf20.js" crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <title>KIMI</title>
    <link rel="icon" type="image/x-icon" href="Images/LOGO.png">
    <link rel="stylesheet" href="main_style.css">

    <style>

    </style>
</head>

<body>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
    <div class="navbar-fixed hide-on-large-only">
        <nav>
            <div class="container nav-wrapper">
                <a href="#" data-target="mobile-demo" class="sidenav-trigger" style="position: absolute; left: -20px;">
                    <i class="fa fa-bars"></i>
                </a>
                <a href="#!" class="nav-logo" style="display: flex; align-items: center; height: 55px;"> 
                    <img src="Images/LOGO.png" alt="Logo" class="hide-on-large-only center" style="height: 55px;">
                    <span class="hide-on-med-and-down navbar-kimi">KIMI</span>
                </a>
                <ul id="nav-mobile" class="right hide-on-med-and-down">
                        <li class="tab">
                            <a href="#shop" class="nav-link active"><b>Shop</b></a>
                        </li>
                        <li class="tab"><a href="#offers" class="nav-link"><b>Offers</b></a></li>
                        <li class="tab"><a href="#learn" class="nav-link"><b>Learn</b></a></li>
                        <li class="tab"><a href="#our-cafe" class="nav-link"><b>About Us</b></a></li>
                    </ul>
            </div>
        </nav>
    </div>

<ul class="sidenav" id="mobile-demo">
    <div class="avc">
        <div class="container">
            <div class="brand">
                <img src="Images/LOGO.png"><span class="navbar-kimi">BeanBoard</span>
            </div>
        </div>
    </div>
    <li class="tab" style="margin-top: -18px !important;">
        <a href="" class="nav-link">
            <i class="fa-solid fa-house nav-icon"></i>
            <span>Home</span>
        </a>
    </li>
    <li class="tab">
        <a href="" class="nav-link">
            <i class="fa-solid fa-circle-user nav-icon"></i>
            <span>My Profile</span>     
        </a>
    </li>
    <li class="tab">
        <a href="" class="nav-link">
            <i class="fa-solid fa-user-gear nav-icon"></i>
            <span>Account Settings</span>
        </a>
    </li>
    <li class="tab">
        <a href="" class="nav-link">
            <i class="fa-solid fa-circle-info nav-icon"></i>
            <span>Notifications</span>
        </a>
    </li>    
</ul>

    <main>
        <div class="sidebar">
            <div class="brand">
                <img src="Images/LOGO.png">
                <span class="navbar-kimi hide-on-med-and-down">BeanBoard</span>
            </div>
            <div class="menuu">
                <!-- Add active class to the current page
                <h5 style="margin-top: -10px;">HOME</h5>
                <h5>EXPLORE</h5>
                <h5>INBOX</h5>
                <h5>NOTIFICATIONS</h5>
                <h5>SETTINGS</h5>
                 -->
                <div class="profile">
                    <div class="profile-top">
                        <img src="Images/<?php echo $user['image']; ?>" alt="avatar" class="avatar" />

                        <div class="profile-stats">
                            <div class="stat">
                                <span class="stat-number"><?php echo $postCount; ?></span>
                                <span class="stat-label">Posts</span>
                            </div>
                            <div class="stat">
                                <span class="stat-number"><?php echo $followerCount; ?></span>
                                <span class="stat-label">Followers</span>
                            </div>
                            <div class="stat" style="margin-left: 10px;">
                                <span class="stat-number"><?php echo $followingCount; ?></span>
                                <span class="stat-label">Following</span>
                            </div>
                        </div>
                    </div>

                    <div class="info">
                        <span class="profname"><?php echo $user['firstname']; ?> <?php echo $user['lastname']; ?></span>
                        <span class="profusername">@<?php echo $user['username']; ?></span>
                    </div>
                </div>
                
                <div class="profilelogout" style="border-radius:20px; background:rgba(255,255,255,0.1); padding:10px;">
                    <a href="?logout=1" style="color: inherit; text-decoration: none;">
                        LOGOUT
                        <i class="fa-solid fa-right-from-bracket logout-icon"></i>
                    </a>
                </div>
            </div>
        </div>

        <!-- FEED -->
        <div class="feed">
            <div class="feed-tabs">
                <div class="tabs-header">
                    <div class="tab active" onclick="switchTab(0)">For You</div>
                    <div class="tab" onclick="switchTab(1)">Following</div>
                    <div class="slider"></div>
                </div>
            </div>

            <div class="feed-content">
                <form action="post.php" method="POST" enctype="multipart/form-data">
                    <div class="post-box hide-on-med-and-down">
                        <div class="post-avatar-container">
                            <img src="Images/<?php echo $user['image']; ?>" class="post-avatar" alt="Profile">
                        </div>
                        <div class="post-input-area">
                            <textarea name="caption" placeholder="What's happening?" rows="1"></textarea>
                            <img id="preview" style="display:block; display:none; max-height:100px; width:auto; height:auto; object-fit:contain; margin-top:5px; border-radius:10px; align-self:flex-start;" />                            
                            <div class="post-actions">
                                <div class="icons">
                                    <i class="fa-solid fa-hashtag"></i>
                                    <label>
                                        <i class="fa-regular fa-image"></i>
                                        <input type="file" name="image" id="imageInput" hidden>
                                    </label>
                                </div>
                                <button type="submit" name="post" class="post-btn">Post</button>
                            </div>
                        </div>
                    </form>
                </div>

                <div class="fyp">
                    <?php
                        $sql = "SELECT 
                            posts.*,
                            users.username,
                            users.firstname,
                            users.image AS user_image,
                            COUNT(comments.id) AS comment_count
                        FROM posts
                        JOIN users ON posts.poster = users.id
                        LEFT JOIN comments ON comments.post = posts.id
                        GROUP BY posts.id
                        ORDER BY posts.created_at DESC;";
                        $result = $mysqli->query($sql);

                        while ($row = $result->fetch_assoc()):
                    ?>
                    <div class="post">
                        <div class="post-header">
                            <img src="Images/<?php echo $row['user_image']; ?>" class="post-profile">

                            <div class="user-info">
                                <span class="name"><?php echo $row['firstname']; ?></span>
                                <span class="username">@<?php echo $row['username']; ?></span>
                            </div>
                        </div>

                        <h5 class="caption"><?php echo $row['caption']; ?></h5>

                        <img src="Images/<?php echo $row['image']; ?>" class="post-image">

                        <div class="post-buttons" style="display:flex; align-items:center; justify-content:space-between;">    
                            <div style="display:flex; align-items:center; gap:5px;">
                                <i class="fa-regular fa-heart" style="font-size:18px; cursor:pointer;"></i>
                                <span style="font-size:14px; line-height:1; cursor:default;"><?php if ($row['likes'] > 0) echo $row['likes'] . ' '; ?>Likes</span>
                                <i class="fa-regular fa-comment" style="font-size:18px; cursor:pointer; margin-left: 15px;"></i>
                                <span style="cursor:default;"><?php if ($row['comment_count'] > 0) echo $row['comment_count'] . ' '; ?> Comments</span>
                            </div>
                        </div>
                        <!-- COMMENT LIST -->
                        <div class="comment-list">
                            <?php
                                $post_id = $row['id'];

                                $comment_sql = "SELECT 
                                                    comments.*,
                                                    users.username,
                                                    users.firstname,
                                                    users.lastname,
                                                    users.image
                                                FROM comments
                                                JOIN users ON comments.commentor = users.id
                                                WHERE comments.post = '$post_id'
                                                ORDER BY comments.created_at ASC";

                                $comment_result = $mysqli->query($comment_sql);

                                while ($comment = $comment_result->fetch_assoc()):
                            ?>
                                <div class="comment-item" style="display:flex; gap:10px; margin-top:10px;">
                                    <img src="Images/<?php echo $comment['image']; ?>" class="user-profile" style="width:30px; height:30px; border-radius:50%;">

                                    <div class="comment-texttext">
                                        <span style="font-weight:600;"><?php echo $comment['firstname']; ?> <?php echo $comment['lastname']; ?></span>
                                        <div style="font-size:14px; margin-top:-6px;">
                                            <?php echo $comment['comment']; ?>
                                        </div>
                                    </div>
                                </div>
                            <?php endwhile; ?>
                        </div>
                        <!-- COMMENT SECTION (static for now, you can make it dynamic next) -->
                        <div class="comment-add">
                            <img src="Images/<?php echo $user['image']; ?>" class="user-profile">

                            <form action="comment.php" method="POST" class="comment-addtext" style="display:flex; width:100%;">
                                <input type="hidden" name="post_id" value="<?php echo $row['id']; ?>">

                                <textarea 
                                    name="comment" 
                                    class="comment-input" 
                                    placeholder="Add a comment.." 
                                    required
                                ></textarea>

                                <button type="submit" class="comment-btn">
                                    <i class="fa-solid fa-paper-plane"></i>
                                </button>
                            </form>
                        </div>

                    </div>
                    <?php endwhile; ?>
                </div>

                <!-- Following posts -->
                <div class="flg">
                    <?php
                    $sql = "SELECT posts.*, users.username, users.firstname, users.image AS user_image, COUNT(comments.id) AS comment_count FROM posts JOIN users ON posts.poster = users.id LEFT JOIN comments ON comments.post = posts.id JOIN follows ON follows.following_id = posts.poster WHERE follows.follower_id = ? GROUP BY posts.id ORDER BY posts.created_at DESC";

                    $stmt = $mysqli->prepare($sql);
                    $stmt->bind_param("i", $currentUserId);
                    $stmt->execute();
                    $result = $stmt->get_result();

                    while ($row = $result->fetch_assoc()):
                    ?>
                    <div class="post">
                        <div class="post-header">
                            <img src="Images/<?php echo $row['user_image']; ?>" class="post-profile">

                            <div class="user-info">
                                <span class="name"><?php echo $row['firstname']; ?></span>
                                <span class="username">@<?php echo $row['username']; ?></span>
                            </div>
                        </div>

                        <h5 class="caption"><?php echo $row['caption']; ?></h5>

                        <img src="Images/<?php echo $row['image']; ?>" class="post-image">

                        <div class="post-buttons" style="display:flex; align-items:center; justify-content:space-between;">    
                            <div style="display:flex; align-items:center; gap:5px;">
                                <i class="fa-regular fa-heart" style="font-size:18px; cursor:pointer;"></i>
                                <span style="font-size:14px; cursor:default;"><?php if ($row['likes'] > 0) echo $row['likes'] . ' '; ?>Likes</span>

                                <i class="fa-regular fa-comment" style="font-size:18px; cursor:pointer; margin-left: 15px;"></i>
                                <span style="cursor:default;"><?php if ($row['comment_count'] > 0) echo $row['comment_count'] . ' '; ?>Comments</span>
                            </div>
                        </div>

                                                <!-- COMMENT LIST -->
                        <div class="comment-list">
                            <?php
                                $post_id = $row['id'];

                                $comment_sql = "SELECT 
                                                    comments.*,
                                                    users.username,
                                                    users.firstname,
                                                    users.lastname,
                                                    users.image
                                                FROM comments
                                                JOIN users ON comments.commentor = users.id
                                                WHERE comments.post = '$post_id'
                                                ORDER BY comments.created_at ASC";

                                $comment_result = $mysqli->query($comment_sql);

                                while ($comment = $comment_result->fetch_assoc()):
                            ?>
                                <div class="comment-item" style="display:flex; gap:10px; margin-top:10px;">
                                    <img src="Images/<?php echo $comment['image']; ?>" class="user-profile" style="width:30px; height:30px; border-radius:50%;">

                                    <div class="comment-texttext">
                                        <span style="font-weight:600;"><?php echo $comment['firstname']; ?> <?php echo $comment['lastname']; ?></span>
                                        <div style="font-size:14px; margin-top:-6px;">
                                            <?php echo $comment['comment']; ?>
                                        </div>
                                    </div>
                                </div>
                            <?php endwhile; ?>
                        </div>

                        <div class="comment-add">
                            <img src="Images/<?php echo $user['image']; ?>" class="user-profile">

                            <form action="comment.php" method="POST" class="comment-addtext" style="display:flex; width:100%;">
                                <input type="hidden" name="post_id" value="<?php echo $row['id']; ?>">

                                <textarea 
                                    name="comment" 
                                    class="comment-input" 
                                    placeholder="Add a comment.." 
                                    required
                                ></textarea>

                                <button type="submit" class="comment-btn">
                                    <i class="fa-solid fa-paper-plane"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                    <?php endwhile; ?>
                </div>
            </div>
        </div>

        <!-- RIGHT PANE -->
        <div class="rpane">
            <!-- 
                Search Box
                <div>
                    <div class="search-box">
                        <p>Search</p>
                    </div>
                </div>
            -->


            <!-- 
                Top Hashtags 
                <div class="tophashtag">
                    <p><span>#pahinga</span> <i class="fa-solid fa-medal"></i></p> 
                    <p><span>#coffeenowpalpitatelater</span> <i class="fa-solid fa-medal"></i></p>
                    <p><span>#mlpa</span> <i class="fa-solid fa-medal"></i></p>
                </div>
                <p class="hashmore">show more</p>
                
            -->
                

            <h5 style="margin-top: -10px; margin-bottom: 12px; font-weight: bold;">Suggestions</h5>

            <?php while($user = $user_result->fetch_assoc()): ?>
            <div class="user-suggestion-box">
                
                <img src="Images/<?php echo !empty($user['image']) ? $user['image'] : 'default.png'; ?>" class="user-suggestion-profile">
                
                <div class="user-suggestion">
                    <span class="namesugg"><?php echo $user['firstname']; ?> <?php echo $user['lastname']; ?></span>
                    <span class="usernamesugg">@<?php echo $user['username']; ?></span>
                </div>

                <!-- FOLLOW FORM -->
                <form method="POST" action="follow.php" style="margin-left:auto;">
                    <input type="hidden" name="following_id" value="<?php echo $user['id']; ?>">
                    <button type="submit" class="follow-btn">Follow</button>
                </form>

            </div>
            <?php endwhile; ?>

            <p class="suggmore">show more</p>


        </div>


    </main>

    <script>
        function switchTab(index){
            const tabs = document.querySelectorAll(".tab");
            const fyp = document.querySelector(".fyp");
            const flg = document.querySelector(".flg");
            const slider = document.querySelector(".slider");

            // Remove active class from all tabs
            tabs.forEach(tab => tab.classList.remove("active"));
            tabs[index].classList.add("active");

            // Show/hide posts
            if(index === 0){
                fyp.style.display = "block";
                flg.style.display = "none";
            } else {
                fyp.style.display = "none";
                flg.style.display = "block";
            }

            // Move slider
            slider.style.left = index * 50 + "%";
        }

        // Initialize default view
        document.addEventListener("DOMContentLoaded", function(){
            switchTab(0);
        });
    </script>

    <script>
        document.addEventListener("DOMContentLoaded", function () {
            const input = document.getElementById("imageInput");
            const preview = document.getElementById("preview");

            input.addEventListener("change", function(event) {
                const file = event.target.files[0];

                if (file) {
                    preview.src = URL.createObjectURL(file);
                    preview.style.display = "block";
                } else {
                    preview.style.display = "none";
                }
            });
        });
    </script>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const elems = document.querySelectorAll('.sidenav');
            const instances = M.Sidenav.init(elems);

            function handleResize() {
                if (window.innerWidth > 992) { // Materialize "large" breakpoint
                    instances.forEach(instance => instance.close());
                }
            }

            window.addEventListener('resize', handleResize);
        });
        document.querySelectorAll('.sidenav a').forEach(link => {
            link.addEventListener('click', () => {
                const instance = M.Sidenav.getInstance(document.querySelector('.sidenav'));
                instance.close();
            });
        });
    </script>
</body>
</html>