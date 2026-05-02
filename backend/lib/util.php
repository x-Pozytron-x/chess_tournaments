<?php

function get_user($id) {


  if ($mysqli->connect_error) {
    die("DB error");
  }

  $stmt = $db->prepare("
    SELECT 
      user_id,
      user_name,
      user_email,
      user_fullname,
      user_role
    FROM users
    WHERE user_id = ?
    LIMIT 1
  ");

  $stmt->bind_param("i", $id);
  $stmt->execute();

  $result = $stmt->get_result();
  $user = $result->fetch_assoc();

  $stmt->close();
  $mysqli->close();

  return $user;
}