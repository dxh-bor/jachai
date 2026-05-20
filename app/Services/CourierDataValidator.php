<?php

namespace App\Services;

use Exception;

class CourierDataValidator
{
    /**
     * Validate Bangladeshi mobile number.
     *
     * @param string $phone
     * @throws Exception
     */
    public static function checkBdMobile(string $phone): void
    {
        if (!preg_match('/^01[3-9]\d{8}$/', $phone)) {
            throw new Exception("Invalid Bangladeshi mobile number: $phone");
        }
    }

    /**
     * Enforce that specific configuration keys are present.
     *
     * @param array $keys
     * @throws Exception
     */
    public static function enforceConfig(array $keys): void
    {
        foreach ($keys as $key) {
            if (!config()->has($key)) {
                throw new Exception("Missing required configuration: $key");
            }
        }
    }
}
