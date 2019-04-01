<?php
//echo 'helloWorld';
$data =$_POST;
$answer = array();
$answer['mes'] = 'OK';
if($data === ''){
    $answer['status'] = 'error';
    $answer['text'] = 'Что то пошло не так';

} else if

($data['name'] === 'rrr'){
    $answer['status'] = 'error';
    $answer['text'] = 'Данный пользователь существует';

}else {
    $answer['status'] = 'OK';
    $answer['text'] = 'Ваша заявка принята!';
}

echo json_encode($answer);
sleep(5);
exit;

?>