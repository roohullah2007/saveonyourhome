<?php

use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\Drivers\Imagick\Driver as ImagickDriver;

return [

    /*
    |--------------------------------------------------------------------------
    | Image Driver
    |--------------------------------------------------------------------------
    |
    | Intervention Image 3.x requires the full driver class name.
    | Available drivers:
    | - Intervention\Image\Drivers\Gd\Driver (bundled with PHP)
    | - Intervention\Image\Drivers\Imagick\Driver (requires ImageMagick)
    |
    | For HEIC/HEIF support (iPhone photos), ImageMagick is recommended.
    |
    */

    'driver' => GdDriver::class,

    /*
    |--------------------------------------------------------------------------
    | Options for Image Driver
    |--------------------------------------------------------------------------
    |
    | Additional driver-specific options.
    |
    */

    'options' => [
        // Enable auto-orientation based on EXIF data
        'autoOrientation' => true,
    ],

];
