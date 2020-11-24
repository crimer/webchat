using Newtonsoft.Json;

namespace MessageChat.ApiHelpers
{
    public class ApiResponse<T>
    {
        public int ResponseCode { get; set; }
        public string ErrorMessage { get; set; }
        public T Data { get; set; }
        public bool IsValid => ResponseCode == 200 && Data != null;
        public ApiResponse(T data, int responseCode, string errorMessage = null)
        {
            Data = data;
            ResponseCode = responseCode;
            ErrorMessage = errorMessage;
        }
        public string ToJson()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
    public class ApiResponse
    {
        public int ResponseCode { get; set; }
        public string ErrorMessage { get; set; }
        public string SuccessMessage { get; set; }
        public bool IsValid => ResponseCode == 200;
        public ApiResponse(int responseCode, string errorMessage = null, string successMessage = null)
        {
            ResponseCode = responseCode;
            ErrorMessage = errorMessage;
            SuccessMessage = successMessage;
        }
        public string ToJson()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
}
