<!doctype html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- <script src="https://cdn.tailwindcss.com"></script> -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        clifford: '#da373d',
                    }
                }
            }
        }
    </script>
</head>

<body style="font-family: Arial, Helvetica, sans-serif;
    background-color: rgb(226 232 240);
    margin-left: auto;
    margin-right: auto;
    margin-top: auto;
    margin-bottom: auto;
    height: 100vh;




" class="bg-slate-200 mx-auto my-auto h-screen flex justify-center">


<div style="
    background-color: white;
            width: max-content;
            margin-top: auto;
    margin-bottom: auto;
    border-radius: 0.75rem/* 12px */;
    padding: 6rem/* 96px */;
    padding-bottom: 4rem/* 64px */;


    " class=" md:w-max w-auto h-content my-auto mx-auto  rounded-xl bg-white p-24 pb-16 w-content">
    <h1 style="
          font-size: 3rem/* 48px */;
    line-height: 1;
    font-weight: 700;

        " class="text-5xl font-bold "> Verify your account
    </h1>

    <div style="
            margin-top: 1rem/* 16px */;
            margin-left: auto;
    margin-right: auto;
        " class="mt-4 mx-auto">

        <p

                style="
                margin-bottom: 2.75rem/* 12px */;
                margin-top: 3rem/* 64px */;
                font-size: 1.3rem;

            "

                class="text-black-300 font-sm mb-3 mt-16"> Confirm your Torch account to have access to our host of services.
            <br>
            Click below to complete the verification process</p>


        <div class="mx-auto ">
                <a style="text-decoration: none; color: white; list-style: none;

    margin-top: 1rem;
            margin-left: auto;
    margin-right: auto;
    background-color: black;
    font-weight: 600;
    padding: 1.25rem/* 20px */;
    font-size: 1.5rem/* 24px */;
    line-height: 2rem/* 32px */;
    color: white;
    border-radius: 0.75rem/* 12px */;
border: 0;

"  href="${environment_url}/verify-email/${code}">Confirm your account</a>

        </div>

    </div>

    <div style="display: flex; align-items: center;">
        <a
                style="    margin-top: 0.5rem/* 40px */;

 margin-left: auto;
    margin-right: auto;
"
                href="${environment_url}">
            <img style=" filter: invert(100%); width: 6rem /* 96px */;  margin-top: 2.5rem/* 40px */;

 margin-left: auto;
    margin-right: auto;" class="to-black mt-10 mx-auto my-auto" src="./torchlogo.png" alt="">
        </a>
        <img src="" alt="">

    </div>


</div>

</body>

</html>