<?php
header("Access-Control-Allow-Origin: *");
if (!isset($_GET['id'])) {
    echo json_encode(array("code" => -1,"msg" => "参数不全"));
    exit;
}
$list_id = $_GET['id'];
echo file_get_contents("http://music.163.com/api/playlist/detail?id=$list_id");