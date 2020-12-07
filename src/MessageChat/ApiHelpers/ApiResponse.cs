using Newtonsoft.Json;

namespace MessageChat.ApiHelpers
{
    public class ApiResponse<T> : ApiResponse
    {
        public T Data { get; set; }
        public ApiResponse(T data, int responseCode, string errorMessage = null) : base(responseCode, errorMessage)
        {
            Data = data;
        }
    }
    public class ApiResponse
    {
        public int ResponseCode { get; set; }
        public string ErrorMessage { get; set; }
        public bool IsValid => ResponseCode == 200;
        public ApiResponse(int responseCode, string errorMessage = null)
        {
            ResponseCode = responseCode;
            ErrorMessage = errorMessage;
        }
        public string ToJson()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
}
