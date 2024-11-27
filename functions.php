<?php
function isMembershipExpired($lastRenewed)
{
    $lastRenewedDate = new DateTime($lastRenewed);
    $currentDate = new DateTime();
    $interval = $lastRenewedDate->diff($currentDate);
    return $interval->m >= 1 || $interval->y > 0;
}